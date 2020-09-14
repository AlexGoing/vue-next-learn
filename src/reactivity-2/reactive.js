import { isObject } from "../shared/utils";
import { mutableHandler } from "./baseHandlers";


export function reactive(target) {
    // 将传入的目标对象创建成一个响应式的对象
    return createReactiveObject(target, mutableHandler);
}
function createReactiveObject(target, baseHandler) {
    if (!isObject(target)) {
        return target;
    }
    const observed =  new Proxy(target, baseHandler);
    return observed;
}