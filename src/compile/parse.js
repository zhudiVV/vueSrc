// ast语法树 vnode

/**
 * ast语法树
 * {
 *  tag: 'div',
 *  attrs: [{id: "app"}],
 *  children: [{}]
 * }
 * 
 * 
 */

// 标签名 a-aaa
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// 命名空间标签 aa:aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 匹配标签结束的 >
const startTagClose = /^\s*(\/?)>/;
// 匹配 {{ }} 表达式
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;


export function parseHTML(html) {

  // 遍历
// 创建一个ast对象
// <div id="app">hello{{ msg }}</div>
function createAstElement(tag, attrs) {
  return {
    tag, // 元素div
    attrs, // 属性
    children: [], // 子节点
    type: 1,
    parent: null
  }
}

let root // 根元素
let createParent // 当前元素父节点
// 数据结构 栈
let stack = []

function start(tag, attrs) { // 开始标签
  let element = createAstElement(tag, attrs)
  if(!root) {
    root = element
  }
  createParent = element
  stack.push(element)
}
function charts(text) {
  // 空格
  // text = text.replace(/\s/g, '')
  text = text.trim()
  if(text) {
    createParent.children.push({
      type: 3,
      text
    })
  }

}
function end(tag) {
  let element = stack.pop()
  createParent = stack[stack.length - 1]
  if (createParent) { // 元素闭合
    element.parent == createParent.tag
    createParent.children.push(element)
  }
}

  while (html) { // html 为空结束
    let textEnd = html.indexOf('<') // 0
    if (textEnd === 0) { // 标签
      // （1）开始标签
      const startTagMatch = parseStartTag() // 开始标签内容
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      // （2）结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }

    }
    // 文本
    let text
    if (textEnd > 0) {
      // 获取文本内容
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      charts(text)
    }
  }

  function parseStartTag() {
    //
    const start = html.match(startTagOpen) // 1.结果 2.false

    if (start) {
      // 创建ast语法树
      let match = {
        tagName: start[1],
        attrs: []
      }
      // 删除 开始标签
      advance(start[0].length)
      // 属性
      // 注意 多个 遍历
      // 注意 结束>
      let attr
      let end
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }

      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }

  function advance(n) {
    html = html.substring(n)
  }
  return root
}