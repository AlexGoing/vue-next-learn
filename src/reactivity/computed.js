import { isFunction } from "../shared/utils";
import { effect, trigger, track } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operations";

export function computed(getterOrOptions) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => {}
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    // 默认要让getter执行一次
    let dirty = true;
    let computed;
    let runner = effect(getter, {
        // 标记是懒执行
        lazy: true,
        computed: true,
        // 当计算属性的依赖发生了变化，只执行scheduler
        scheduler: () => {
            if (!dirty) {
                dirty = true,
                trigger(computed, TriggerOpTypes.SET, 'value')
            }
        }
    })
    let value;
    computed = {
        // 获取计算属性的值
        get value() {
            // 多次执行，依赖不变，不会重新执行getter
            if (dirty) {
                value = runner();
                dirty = false;
                track(computed, TrackOpTypes.GET, 'value')
            }
            return value;
        },
        set value(newValue) {
            setter(newValue)
        }
    };
    return computed;
}