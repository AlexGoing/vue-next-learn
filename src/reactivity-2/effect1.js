export function effect(fn, options = {}) {
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}

let uid = 0;
let activeEffect;
const effectStack = [];
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) {
            try {
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            } finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length -1]
            }
        }
    }
    effect.options = options;
    effect.id = uid++;
    // 依赖那些属性，那些属性变化后就去执行
    effect.deps = [];
    return effect;
}
const targetMap = new WeakMap(); //用法和map一致  但是弱引用 不会导致内存泄漏
let current;
export function track(target, type, key) {
    if (activeEffect == undefined) {
        return; // 说明取值的属性 不依赖于 effect
    }
    let depsMap = targetMap.get(target); // 根据key 来进行取值

    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect); // { "{name:'zf'}":{name:set(effect)}  }
        // activeEffect.deps.push(dep); // 让这个effect 记录dep属性
    }
};
export function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target); // 获取当前对应的map
    if (!depsMap) {
        return;
    }
    if (type === TriggerOpTypes.ADD) { // 对数组新增属性 会触发length 对应的依赖 在取值的时候回对length属性进行依赖收集
        add(depsMap.get(Array.isArray(target) ? 'length' : ''));
    }
}