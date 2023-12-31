/*
 * @Author: zdh
 * @Date: 2023-07-02 17:37:02
 * @LastEditTime: 2023-07-15 16:27:28
 * @Description: 
 */
import { compileToFunction } from "./compile/index"
import { initGlobalApi } from "./global-api/index"
import { initMixin } from "./init"
import { stateMixin } from "./initState"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"
import { createElm, patch } from "./vnode/patch"


function Vue(options) {
    // 初始化
    this._init(options)
}

initMixin(Vue)

lifecycleMixin(Vue) // 添加生命周期
renderMixin(Vue) // 添加render
stateMixin(Vue) // 给vm添加 $nextTick
// 全局方法 Vueminin Vue.component Vue.extend
initGlobalApi(Vue)


export default Vue