import Vue, { RenderContext, VNodeData } from 'vue';
import { ObjectIndex } from './types';

type Context = RenderContext & { data: VNodeData & ObjectIndex };

type InheritContext = Partial<VNodeData> & ObjectIndex;

const inheritKey = [
  'ref',
  'key',
  'style',
  'class',
  'attrs',
  'refInFor',
  'nativeOn',
  'directives',
  'staticClass',
  'staticStyle',
];

const mapInheritKey: ObjectIndex = { nativeOn: 'on' };

// inherit partial context, map nativeOn to on
export function inherit(
  context: Context,
  inheritListeners?: boolean
): InheritContext {
  const result = inheritKey.reduce((obj, key) => {
    if (context.data[key]) {
      obj[mapInheritKey[key] || key] = context.data[key];
    }
    return obj;
  }, {} as InheritContext);
  // TODO: TS: 不懂
  //  不是很懂这里哎，从上下文的data里 把数据拷贝出来了，最后就渲染到DOM上了
  if (inheritListeners) {
    // TODO: TS: 不懂
    //  这里是做什么用的-button里暂时没用到
    result.on = result.on || {};
    Object.assign(result.on, context.data.on);
  }

  return result;
}

// TODO: TS: 注解
//  给组件绑定点击事件- v-on @xxx
//  listeners: 组件上监听的事件对象，在组件上监听 `event-name`，
//  listeners 对象就有 `event-name` 属性，值为函数，数据可通过该函数的参数抛到父组件。
//  listeners 是 `data.on` 的别名。
// emit event
export function emit(context: Context, eventName: string, ...args: any[]) {
  const listeners = context.listeners[eventName];
  if (listeners) {
    if (Array.isArray(listeners)) {
      listeners.forEach((listener) => {
        listener(...args);
      });
    } else {
      listeners(...args);
    }
  }
}

// mount functional component
export function mount(Component: any, data?: VNodeData) {
  const instance = new Vue({
    el: document.createElement('div'),
    props: Component.props,
    render(h) {
      return h(Component, {
        props: this.$props,
        ...data,
      });
    },
  });

  document.body.appendChild(instance.$el);

  return instance;
}
