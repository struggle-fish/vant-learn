/**
 * Create a basic component with common options
 */
import '../../locale';
import { isFunction } from '..';
import { camelize } from '../format/string';
import { SlotsMixin } from '../../mixins/slots';
import Vue, {
  VNode,
  VueConstructor,
  ComponentOptions,
  RenderContext,
} from 'vue';
import { DefaultProps, FunctionComponent } from '../types';

export interface VantComponentOptions extends ComponentOptions<Vue> {
  functional?: boolean;
  install?: (Vue: VueConstructor) => void;
}

export type TsxBaseProps<Slots> = {
  key: string | number;
  // hack for jsx prop spread
  props: any;
  class: any;
  style: string | object[] | object;
  scopedSlots: Slots;
};

export type TsxComponent<Props, Events, Slots> = (
  props: Partial<Props & Events & TsxBaseProps<Slots>>
) => VNode;

function install(this: ComponentOptions<Vue>, Vue: VueConstructor) {
  const { name } = this;
  Vue.component(name as string, this);
  Vue.component(camelize(`-${name}`), this);
}

// unify slots & scopedSlots
export function unifySlots(context: RenderContext) {
  // use data.scopedSlots in lower Vue version
  const scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
  const slots = context.slots();

  Object.keys(slots).forEach((key) => {
    if (!scopedSlots[key]) {
      scopedSlots[key] = () => slots[key];
    }
  });

  return scopedSlots;
}

// TODO: TS: 注解
//  这个好像是把组件变相的转成函数了-为什么要这么做？
//  https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6
//  函数式组件-
// should be removed after Vue 3
function transformFunctionComponent(
  pure: FunctionComponent
): VantComponentOptions {
  return {
    functional: true,
    props: pure.props,
    model: pure.model,
    render: (h, context): any =>
      pure(h, context.props, unifySlots(context), context),
  };
}

export function createComponent(name: string) {
  // TODO: TS: 注解 泛型语法: 名字<T1, T2, ...> 返回一个泛型函数
  //   src 是个函数
  return function <Props = DefaultProps, Events = {}, Slots = {}>(
    sfc: VantComponentOptions | FunctionComponent
  ): TsxComponent<Props, Events, Slots> {
    if (isFunction(sfc)) {
      sfc = transformFunctionComponent(sfc);
    }

    if (!sfc.functional) {
      sfc.mixins = sfc.mixins || [];
      sfc.mixins.push(SlotsMixin);
    }

    sfc.name = name;
    sfc.install = install;

    return sfc as TsxComponent<Props, Events, Slots>;
  };
}
