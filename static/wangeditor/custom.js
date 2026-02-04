/**
 * @description 自定义 elem
 * @author wangfupeng
 */

// 关键修复：定义 MENU_CONF（在文件最顶部）
const MENU_CONF = [
    {
        'zh-CN': { link: 'https://www.wangeditor.com/', text: '官方文档' },
        'en': { link: 'https://www.wangeditor.com/en/', text: 'Official Docs' }
    },
    {
        'zh-CN': { link: 'https://github.com/wangeditor-team/wangEditor', text: 'GitHub 源码' },
        'en': { link: 'https://github.com/wangeditor-team/wangEditor', text: 'GitHub Source' }
    },
    {
        'zh-CN': { link: 'https://www.wangeditor.com/v5/', text: 'v5 版本' },
        'en': { link: 'https://www.wangeditor.com/en/v5/', text: 'v5 Version' }
    }
];

// ------------------------------------------ native-shim start ------------------------------------------

// 参考 https://github.com/webcomponents/custom-elements/blob/master/src/native-shim.js
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements v1. It sets new.target to the value of
 * this.constructor so that the native HTMLElement constructor can access the
 * current under-construction element's definition.
 */
;(function () {
  if (
    // No Reflect, no classes, no need for shim because native custom elements
    // require ES2015 classes or Reflect.
    window.Reflect === undefined ||
    window.customElements === undefined ||
    // The webcomponentsjs custom elements polyfill doesn't require
    // ES2015-compatible construction (`super()` or `Reflect.construct`).
    window.customElements.polyfillWrapFlushCallback
  ) {
    return
  }
  const BuiltInHTMLElement = HTMLElement
  /**
   * With jscompiler's RECOMMENDED_FLAGS the function name will be optimized away.
   * However, if we declare the function as a property on an object literal, and
   * use quotes for the property name, then closure will leave that much intact,
   * which is enough for the JS VM to correctly set Function.prototype.name.
   */
  const wrapperForTheName = {
    HTMLElement: /** @this {!Object} */ function HTMLElement() {
      return Reflect.construct(BuiltInHTMLElement, [], /** @type {!Function} */ this.constructor)
    },
  }
  window.HTMLElement = wrapperForTheName['HTMLElement']
  HTMLElement.prototype = BuiltInHTMLElement.prototype
  HTMLElement.prototype.constructor = HTMLElement
  Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement)
})()
// ------------------------------------------ native-shim end ------------------------------------------

// ------------------------------------------ 顶部导航 start ------------------------------------------
!(function () {
  // 当前语言
  const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN'

  // 自定义组件
  class MyNav extends HTMLElement {
    constructor() {
      super()

      const shadow = this.attachShadow({ mode: 'open' })
      const document = shadow.ownerDocument

      const style = document.createElement('style')
      style.innerHTML = `
      .container {
        display: flex;
        padding: 10px;
        background-color: #4474c8;
        color: #fff;
      }
      .container a {
        color: #fff;
        text-decoration: none;
      }
      .container h1 {
        flex: 1;
        margin: 0;
        font-size: 26px;
      }
      .container .right-container {
        width: 200px;
        text-align: right;
        line-height: 26px;
      }
    `
      shadow.appendChild(style)

      // 容器
      const container = document.createElement('div')
      container.className = 'container'

      // 标题
      const header = document.createElement('h1')
      header.textContent = ''
      this.header = header

      // 右侧链接
      const rightContainer = document.createElement('div')
      rightContainer.className = 'right-container'
      if (LANG === 'en') {
        rightContainer.innerHTML = `
        <a href="https://www.wangeditor.com/en/ ">Document</a>
        &nbsp;
        <a href="https://github.com/wangeditor-team/wangEditor/tree/master/packages/editor/demo ">Source</a>
      `
      } else {
        rightContainer.innerHTML = `
        <a href="https://www.wangeditor.com/ ">文档</a>
        &nbsp;
        <a href="https://github.com/wangeditor-team/wangEditor/tree/master/packages/editor/demo ">源码</a>
      `
      }

      container.appendChild(header)
      container.appendChild(rightContainer)

      shadow.appendChild(container)
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'title') {
        if (oldValue == newValue) return
        this.header.textContent = newValue
      }
    }
  }
  MyNav.observedAttributes = ['title']
  window.customElements.define('demo-nav', MyNav)
})()
// ------------------------------------------ 顶部导航 end ------------------------------------------

// ------------------------------------------ 左侧菜单 start ------------------------------------------

!(function () {
  // 当前语言
  const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN'

  // 自定义组件
  class MyMenu extends HTMLElement {
    constructor() {
      super()

      const shadow = this.attachShadow({ mode: 'open' })
      const document = shadow.ownerDocument

      const style = document.createElement('style')
      style.innerHTML = `
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        ul li {
          margin: 0;
          margin-bottom: 18px;
        }
        a {
          color: #333;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `
      shadow.appendChild(style)

      const container = document.createElement('div')
      container.innerHTML = `<ul>
        ${MENU_CONF.map(item => {
          const { link, text } = item[LANG]
          return `<li><a href="${link}">${text}</a></li>`
        }).join('')}
      </ul>`

      shadow.appendChild(container)
    }
  }
  window.customElements.define('demo-menu', MyMenu)
})()
// ------------------------------------------ 左侧菜单 end ------------------------------------------

// 关键修复：删除所有 export 语句
// 如果有需要暴露给外部的变量，使用 window 挂载：
// window.MyNav = MyNav;
// window.MyMenu = MyMenu;