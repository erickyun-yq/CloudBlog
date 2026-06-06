<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import { TextAlign } from '@tiptap/extension-text-align'

const value = ref(`This toolbar showcases **all available formatting options** using built-in handlers. Try the different controls to see them in action!

You can apply **bold**, *italic*, <u>underline</u>, ~~strikethrough~~, and \`inline code\` formatting to your text.
`)

const items: EditorToolbarItem[][] = [
  [{
    kind: 'undo',
    icon: 'mdi:undo',
    size: 'xl',
    tooltip: { text: '撤销' }
  }, {
    kind: 'redo',
    icon: 'mdi:redo',
    size: 'xl',
    tooltip: { text: '重做' }
  }, {
    icon: 'lucide:ellipsis-vertical',
    size: 'xl',
    disabled: true,
    class: 'cursor-default! px-0',
  }, {
    icon: 'oui:editor-heading',
    size: 'xl',
    tooltip: { text: '格式' },
    content: {
      align: 'start'
    },
    items: [{
      kind: 'paragraph',
      icon: 'icon-park-solid:paragraph-round',
      size: 'lg',
      label: '正文'
    }, {
      kind: 'heading',
      level: 1,
      icon: 'i-lucide-heading-1',
      size: 'lg',
      label: '标题 h1'
    }, {
      kind: 'heading',
      level: 2,
      icon: 'i-lucide-heading-2',
      size: 'lg',
      label: '标题 h2'
    }, {
      kind: 'heading',
      level: 3,
      icon: 'i-lucide-heading-3',
      size: 'lg',
      label: '标题 h3'
    }, {
      kind: 'heading',
      level: 4,
      icon: 'i-lucide-heading-4',
      size: 'lg',
      label: '标题 h4'
    }]
  }, {
    kind: 'mark',
    mark: 'bold',
    icon: 'ls:bold',
    size: 'sm',
    class: 'p-3',
    tooltip: { text: '加粗' }
  }, {
    kind: 'highlight',
    icon: 'material-symbols:ink-highlighter-rounded',
    size: 'xl',
    tooltip: { text: '高亮' }
  }, {
    icon: 'lucide:ellipsis',
    size: 'xl',
    tooltip: { text: '其他' },
    content: {
      align: 'start'
    },
    items: [{
      kind: 'mark',
      mark: 'italic',
      icon: 'mingcute:italic-fill',
      size: 'lg',
      label: '斜体'
    }, {
      kind: 'mark',
      mark: 'underline',
      icon: 'mdi:format-underline',
      size: 'lg',
      label: '下划线'
    }, {
      kind: 'mark',
      mark: 'strike',
      icon: 'fa7-solid:strikethrough',
      size: 'lg',
      label: '删除线'
    }]
  }, {
    icon: 'lucide:ellipsis-vertical',
    size: 'xl',
    disabled: true,
    class: 'cursor-default! px-0',
  }, {
    icon: 'i-lucide-align-justify',
    size: 'xl',
    tooltip: { text: '文本对齐' },
    content: {
      align: 'start'
    },
    items: [{
      kind: 'textAlign',
      align: 'left',
      icon: 'lucide:align-left',
      size: 'md',
      label: '左对齐'
    }, {
      kind: 'textAlign',
      align: 'center',
      icon: 'lucide:align-center',
      size: 'md',
      label: '居中对齐'
    }, {
      kind: 'textAlign',
      align: 'right',
      icon: 'lucide:align-right',
      size: 'md',
      label: '右对齐'
    }, {
      kind: 'textAlign',
      align: 'justify',
      icon: 'lucide:align-justify',
      size: 'md',
      label: '两端对齐'
    }]
  }, {
    icon: 'i-lucide-list',
    size: 'xl',
    tooltip: { text: '列表' },
    content: {
      align: 'start'
    },
    items: [{
      kind: 'bulletList',
      icon: 'mdi:format-list-bulleted',
      size: 'lg',
      label: '无序列表'
    }, {
      kind: 'orderedList',
      icon: 'lucide:list-ordered',
      size: 'lg',
      label: '有序列表'
    },]
  }, {
    kind: 'blockquote',
    icon: 'i-lucide-text-quote',
    size: 'xl',
    tooltip: { text: '块引用' }
  }, {
    kind: 'horizontalRule',
    icon: 'i-lucide-separator-horizontal',
    size: 'xl',
    tooltip: { text: '水平线' }
  }, {
    icon: 'tabler:code',
    size: 'xl',
    tooltip: { text: '代码' },
    content: {
      align: 'start'
    },
    items: [{
      kind: 'mark',
      mark: 'code',
      icon: 'i-lucide-code',
      size: 'lg',
      label: '行内代码'
    }, {
      kind: 'codeBlock',
      icon: 'i-lucide-square-code',
      size: 'lg',
      label: '代码块'
    }]
  }, {
    kind: 'table',
    icon: 'i-lucide-table',
    size: 'xl',
    tooltip: { text: '表格' }
  }, {
    icon: 'lucide:ellipsis-vertical',
    size: 'xl',
    disabled: true,
    class: 'cursor-default! px-0',
  }, {
    kind: 'image',
    icon: 'lets-icons:img-load-box-fill',
    size: 'xl',
    tooltip: { text: '图片' }
  }, {
    kind: 'video',
    icon: 'hugeicons:video-ai',
    size: 'xl',
    tooltip: { text: '视频' }
  }, {
    // kind: 'file',
    icon: 'mingcute:formula-fill',
    size: 'xl',
    tooltip: { text: '公式' }
  }, {
    kind: 'link',
    icon: 'fa7-solid:link',
    size: 'xl',
    tooltip: { text: '链接' }
  }],
]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    :extensions="[TextAlign.configure({ types: ['heading', 'paragraph'] })]"
    class="w-full min-h-dvh flex flex-col gap-4 rounded-lg z-100"
  >
    <UEditorToolbar
      :editor="editor"
      :items="items"
      placeholder="Type / for commands..."
      class="w-full overflow-x-auto z-200 justify-center lg:flex hidden"
      layout="fixed"
    />
    <UEditorDragHandle :editor="editor" />
  </UEditor>
</template>
