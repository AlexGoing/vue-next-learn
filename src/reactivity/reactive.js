import { isObject } from "../shared/utils";
import { mutableHandlers } from "./baseHandlers";

export function reactive(target) {
    // 用proxy进行代理 创建一个响应式的对象 目标对象可能不一定是数组或者对象 
    return createReactiveObject(target, mutableHandlers);
}
function createReactiveObject(target, baseHandler) {
    // 如果不是对象，就不执行
    if(!isObject(target)) {
        return
    }
    const observed = new Proxy(target, baseHandler);
    // 返回代理后的结果
    return observed;
}