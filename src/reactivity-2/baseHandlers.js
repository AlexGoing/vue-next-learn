import { isObject, hasOwn, hasChanged } from "../shared/utils";
import { reactive } from "./reactive";
import { track, trigger } from "../reactivity/effect";

const get = createGetter();
const set = createSetter();

function createGetter() {
    return function get(target, key, receiver) {
        // 对对象进行了取值
        // Reflect是有返回值的，可以知道成功还是失败
        const result = Reflect.get(target, key, receiver);
        // console.log('取值操作', target, key, receiver);
        // 依赖收集
        track(target, 'get', key)
        if (isObject(result)) { 
            return reactive(result);
        }
        return result
    }
}
function createSetter() {
    return function set(target, key, value, receiver) {
        const hadKey = hasOwn(target, key);
        const oldValue = target[key];
        const result = Reflect.set(target, key, value, receiver);

        // todo..
        // console.log(999, !hadKey, hasChanged(value, oldValue));
        // console.log('设置值操作', target, key, value, receiver, 3, Reflect.get(target, key, receiver));
        if (!hadKey) {
            console.log('新增', target, key);
            // 依赖新增
            trigger(target, 'add', key, value);
        }
        else if (hasChanged(value, oldValue)) {
            console.log('修改', target, key)
            // 触发依赖更新
            trigger(target, 'set', key, value, oldValue);
        }
        return result;
    }
}
export const mutableHandler = {
    get,
    set
}