## 1.JWT 基础介绍

​        官方解释：JSON Web Token （JWT） 是一种开放标准 （RFC 7519），它定义了一种紧凑且独立的方式，用于在各方之间以 JSON 对象的形式安全地传输信息。此信息可以验证和信任，因为它是经过数字签名的。JWT 可以使用密钥（使用 HMAC算法）或使用 RSA 或 ECDSA 的公钥/私钥对进行签名。

#### 2.JWT的使用场景及好处

​       jwt一般适用于身份验证、授权、信息交换、单点登录等场景，以下介绍两种：

​       1）身份验证（Authentication）：JWT可以被用作用户登录的身份验证凭证。当用户成功登录后，服务端可以生成一个包含用户信息的JWT，并将其返回给客户端。以后，客户端在每次请求时都会携带这个JWT，服务端通过验证JWT的签名来确认用户的身份。

​      2）单点登录（Single Sign-On)：JWT可以被用于支持单点登录，使得用户在多个应用之间只需要登录一次即可使用多个应用，从而提供用户体验。

好处：

​     1）去耦：不需要绑定到一个特定的身份验证方案。Token可以在任何地方生成，只要在你的API被调用的时候生成即可

​     2）更适用于移动应用：如果客户端是一个原生的平台，如IOS，Android等，其Cookie是不被支持的，需要通过cookie容器进行处理，这时采用Token认证机制就会简单的多。

​     3）CSRF：由于JWT一般不再依赖于Cookie，所以不需要考虑对CSRF（跨站请求伪造）的防范。

问题：JWT本身包含了认证信息，因此JWT生成的令牌一旦信息泄露，任何人都可以获得令牌的所有权限。为了减少盗用，JWT的有效期不宜设置太长。对于某些重要操作，用户在使用时应该每次都进行身份验证。并且JWT不建议使用HTTP协议来传输代码，为了减少盗用和窃取，而是使用加密的HTTPS协议进行传输。

#### 3.JWT的组成

JSON Web令牌由Header+Payload+Signature三部分组成，部分之间用·分隔，通常结构如下：

```
xxxxx.yyyyy.zzzzz
```

​     1)  JWT头部是一个描述JWT元数据的JSON对象，通常如下：

```
{
  "alg": "HS256",
  "typ": "JWT",
}
```

alg属性表示JWT签名使用的算法，这里默认使用HMAC SHA256；typ属性表示令牌的类型，JWT令牌统一写为JWT，然后用base64 url算法将上诉对象转换保存，生成JWT的第一部分

​    2）JWT第二部分有效载荷

```
iss: jwt签发者
sub: jwt所面向，使用jwt的用户
aud: 接收jwt的一方
exp: jwt的过期时间，这个过期时间必须大于签发时间
nbf: 定义在指定时间之前，该jwt都是不可用的.
iat: jwt的签发时间
jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击
```

另外还可以自定义私有字段：

```
{
  "admin": true
}
```

然后同样用base64 url算法将上诉对象转换保存，生成JWT的第二部分

​      3）签名

对上前面两部分通过指定算法生成哈希，以确保不会被篡改。注意：secret是密钥，不可泄露

```
HMACSHA256(base64UrlEncode(header) + "." +base64UrlEncode(payload),secret)
```

最后生成一串JWT值，这里就不进行验证了，JWT解析地址：https://jwt.io/#libraries

#### 4.java中的使用

引入maven依赖

```
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.0</version>
</dependency>
<!--- 在目中建议使用JJWT，因为相对其API比较友好 --->
<!--- 这里我使用的是java-jwt --->
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.18.2</version>
</dependency>
```

在项目中新建JwtTokenUtil类

```
public class JwtTokenUtil {

    //设置密钥
    @Value("${jwt.secret}")
    private static String secret;

    //设置签发者
    @Value("${jwt.audience}")
    private static String audience;

    /**
     * Created On : 2023/06/24.
     * <p>
     * Author : YUNMENG
     * <p>
     * Description: 生成token
     * @param map2 包含用户信息的map
     */
    public static String createToken(Map<String, Object> map2){
        String token = "";
        Map<String, Object> map1 = new HashMap<>();
        map1.put("alg", "HS256");
        map1.put("typ", "JWT-KING");
        /*iss: jwt签发者
          sub: jwt所面向的用户
          aud: 接收jwt的一方
          exp: jwt的过期时间，这个过期时间必须要大于签发时间
          nbf: 定义在什么时间之前，该jwt都是不可用的.
          iat: jwt的签发时间
          jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击
        */
   
        //配置payload信息
        map2.put("iss", audience);  //签发者
        map2.put("exp", System.currentTimeMillis() / 1000 + CommonConstant.TOKEN_EXPIRE_TIME); //过期时间
        map2.put("iat", System.currentTimeMillis() / 1000); //签发时间
        token = JWT.create().withHeader(map1)
                .withPayload(map2)
                .sign(Algorithm.HMAC256(secret));
        return token;
    }

    /**
     * Created On : 2023/06/24.
     * <p>
     * Author : YUNMENG
     * <p>
     * Description:  验证token值令牌解析token值
     */
    public static HashMap<String, String> analysisToken(String token) {

        //返回map
        HashMap<String, String> map = new HashMap<>();

        //验证token是否有效
        JWTVerifier verification = JWT.require(Algorithm.HMAC256(secret)).build();

        DecodedJWT decodedJWT;
        Map<String, Claim> claims;

        try {
            decodedJWT = verification.verify(token);
            claims = decodedJWT.getClaims();
            //获取payload信息
            map.put("iss", claims.get("iss").asString());
            map.put("sub", claims.get("sub").asString());
            map.put("aud", claims.get("aud").asString());
            map.put("exp", claims.get("exp").asDate().toString());
            map.put("iat", claims.get("iat").asDate().toString());
            map.put("jti", claims.get("jti").asString());
        } catch (Exception e) {
            throw new HotelException(HotelExceptionEnum.HOTEL_TOKEN_EMPTY);
        }

        return map;
    }
}
```

需要注意的是一般JWT会提供decode(String token) ，这个方法并不会提供secret验证，无法验证token签名的安全性，一般JJWT依赖使用

```

 /**
     *  从jwt中获取 载荷 信息
     * @param jwt
     * @return
     */
    private static Claims getClaimsFromJwt(String jwt) {
        Claims claims = null;
        try {
            claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(jwt).getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return claims;
    }
```

我这里使用：

```
  //验证token是否有效
 JWTVerifier verification = JWT.require(Algorithm.HMAC256(secret)).build();
 DecodedJWT decodedJWT= verification.verify(token);
```

