> &quot;通常在构建web应用时，消息推送是一个很常见的需求，比如站内消息推送、系统告警通知等。**SSE (Server-Sent Events)** 就是基于这种场景而生的。SSE是基于HTTP协议的单向通信机制，允许服务器向浏览器发送实时更新，原生支持断线重连和事件ID追踪。

#### **SSE**与其他技术相比？
| 技术 | 协议 | 通信方向 | 复杂度 | 适用场景 |
|------|------|-----|-----|-----|
| **SSE**  | HTTP/1.1 | 单向通信(服务器->客户端) | 低 | 实时通知、消息通信 | 
| WebSocket | WS/WSS | 双向通信 | 高 | 聊天、实时协作、游戏 | 
| Long Polling | HTTP | 客户端主动拉 | 中 | 兼容性要求高的场景 |

**SSE**的核心优势：
- 自动重连：客户端在断开是会自动尝试重新连接
- 轻量级协议：基于标准的HTTP协议，无需而外的协议支持
- 浏览器原生支持：现代浏览器可通过 ` EventSource ` API直接调用
- 集群支持：通过Redis的 Pub/Sub可实现分布式消息的推送

#### 架构设计和核心组件
##### 整体架构图
![GitHub Logo](/images/logo.png)

##### 核心组件详解
###### 1. 引入依赖
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```
###### 2. 配置连接管理器-SseEmitterManager 
SseEmitterManager是整个**SSE**方案的核心---管理所有客户端的连接、提供订阅、推送和自动清理的能力
```
@Slf4j
@Component
public class SseEmitterManager {

    /**
     *(前端sse连接访问标识 -> SseEmitter)
     */
    private final Map<String, Map<String, SseEmitter>> clientEmitterMap = new ConcurrentHashMap<>();

    /**
     * @params  : [uniqueId, usage](用户标识, 连接标识（连接类型）)
     * @return : org.springframework.web.servlet.mvc.method.annotation.SseEmitter
     * @description : 建立SSE连接
     */
    public SseEmitter connect(String uniqueId, String usage) {
        // 超时时间设为0表示不超时，也可设置具体毫秒数
        SseEmitter emitter = new SseEmitter(0L);

        // 注册回调：连接关闭时清理
        emitter.onCompletion(() -> removeEmitter(uniqueId, usage));
        emitter.onTimeout(() -> {
            log.warn("SSE timeout for user:{}, token:{}", uniqueId, usage)
            removeEmitter(uniqueId, usage)
        });
        emitter.onError(e -> {
            log.warn("SSE error for user:{}, token:{}", uniqueId, usage)
            removeEmitter(uniqueId, usage)
        });

        // 存储连接
        clientEmitterMap.computeIfAbsent(
                uniqueId, k -> new ConcurrentHashMap<>())
                .put(usage, emitter);

        return emitter;
    }

    /**
     * @params  : [uniqueId, usage, eventName, message](用户标识,连接类型,推送事件名,推送信息)
     * @description : 向指定用户推送消息
     */
    public void sendToUser(String uniqueId, String usage, String eventName, Object message) {
        Map<String, SseEmitter> emitters = clientEmitterMap.get(uniqueId);
        if (emitters == null || emitters.isEmpty()) {
            log.debug("User {} not online, message stored for later", uniqueId);
            return;
        }

        // 向该用户指定连接推送
        emitters.forEach((usages, emitter) -> {
            if (usages.equals(usage)) {
                try {
                    emitter.send(SseEmitter.event()
                            .name(eventName)
                            .data(message));
                } catch (IOException e) {
                    log.error("Send to user {} failed, removing emitter", uniqueId, e);
                    removeEmitter(uniqueId, usage);
                }
            }
        });
    }

    /**
     * @params  : [eventName, usage, message](事件名,连接类型,消息)
     * @description : 全站广播
     */
    public void broadcast(String eventName,String usage, Object message) {
        clientEmitterMap.forEach((uniqueId, emitters) -> {
            sendToUser(uniqueId, usage, eventName, message);
        });
        log.info("Broadcast message to {} users", clientEmitterMap.size());
    }

    /**
     * @params  : [uniqueId, token]
     * @description : 删除Sse事件
     */
    private void removeEmitter(String uniqueId, String usage) {
        Map<String, SseEmitter> emitters = clientEmitterMap.get(uniqueId);
        if (emitters != null) {
            emitters.remove(usage);
            if (emitters.isEmpty()) {
                clientEmitterMap.remove(uniqueId);
            }
        }
    }
}
```
###### 3. Redis 配置消息订阅者
通过实现MessageListener 接口，实现监听redis 发布频道，比如："message:topic",当收到redis频道消息时，将消息JSON实例化为SseEmitterManager对象，推送到订阅用户
```
@Slf4j
@Component
public class RedisMessageSubscriber implements MessageListener {

    @Autowired
    private SseEmitterManager sseEmitterManager;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onMessage(@NonNull Message message, byte[] pattern) {
        try {
            String channel = new String(message.getChannel());
            String body = new String(message.getBody());

            // 解析消息
            StationMessage msg = objectMapper.readValue(body, StationMessage.class);
            log.info("Received Redis message: channel={}, type={}, target={}",
                    channel, msg.getType(), msg.getTargetUniqueId());
            if ("personal".equals(msg.getType())) {
                // 私信：发给指定用户
                sseEmitterManager.sendToUser(msg.getTargetUniqueId(), msg.getUsage(), msg.getEventName(), msg.getContent());
            } else if ("broadcast".equals(msg.getType())) {
                // 广播：发给所有在线用户
                sseEmitterManager.broadcast(msg.getEventName(), msg.getUsage(), msg.getContent());
            }

        } catch (Exception e) {
            log.error("Failed to process Redis message", e);
        }
    }
}
```
###### 4. Redis 监听器配置
RedisMessageListenerContainer是Spring Data Redis提供的消息容器，它会自动管理订阅和监听线程。
```
    /**
     * @params  : [connectionFactory, listenerAdapter]
     * @return : org.springframework.data.redis.listener.RedisMessageListenerContainer
     * @description : 定义 RedisMessageListenerContainer，并绑定 listenerAdapter 和频道
     */
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(RedisConnectionFactory connectionFactory,MessageListenerAdapter listenerAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listenerAdapter, new ChannelTopic("online.admin"));
        container.addMessageListener(listenerAdapter, new ChannelTopic("online.user"));
        container.addMessageListener(listenerAdapter, new ChannelTopic("comment") );//多模式匹配
        return container;
    }

    /**
     * @params  : []
     * @return : org.springframework.data.redis.listener.adapter.MessageListenerAdapter
     * @description : 定义 MessageListenerAdapter，指定 subscriber 和方法名，自定义解析信息方法 管理端
     */
    @Bean
    public MessageListenerAdapter listenerAdapter(RedisMessageSubscriber subscriber){
        return new MessageListenerAdapter(subscriber, "onMessage");
    }
```

###### 5. 消息实体对象
主要是Redis消息发布的载体对象
```
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StationMessage {

    /**
     * 消息Id
     */
    private String id;

    /**
     * personal:私信, broadcast:广播
     */
    private String type;

    /**
     * 私信时的目标用户ID
     */
    private String targetUniqueId;

    /**
     * 前端固定连接标识
     */
    private String usage;

    /**
     * 推送事件类型
     */
    private String eventName;

    /**
     * 消息内容
     */
    private Object content;

    /**
     * 发送者ID
     */
    private String senderId;

    /**
     * 时间戳
     */
    private Instant timestamp;
}
```

###### 6. controller层消息订阅
主要是与前端建立起连接，通过连接把用户订阅的消息实时推送给用户
```
    /**
     * SSE连接端点
     */
    @GetMapping(value = "/account/user/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter sseAccountOnlineInfo(@RequestParam String usage) {
        String token = UUID.randomUUID().toString(); // 举例，正常token不由这拿
        return sseEmitterManager.connect(usage, token);
    }
```

##### 注意事项：
**Q1.** 超时配置‌：SseEmitter默认超时时间为30秒，长连接场景需手动设置为0L禁用自动超时，避免连接意外断开

**Q2.** ‌回调注册‌：必须完整实现onCompletion、onTimeout、onError三个回调，及时释放资源避免内存泄漏

**Q3.** 线程池隔离‌：自定义专用线程池替代默认的Executors.newCachedThreadPool()，避免无限制创建线程引发OOM

