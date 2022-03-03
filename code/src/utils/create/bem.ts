/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 * -  中划线：仅作为连字符使用，表示某个块或者某个子元素的多单词之间的连接记号
 * __ 双下划线：双下划线用来连接块和块的子元素
 * __ 双下划线：单下划线用来描述一个块或者块的子元素的一种状态
 * BEM的命名规矩很容易记：block-name__element-name--modifier-name，也就是模块名 + 元素名 + 修饰器名。
 *
 * var test = createBEM('vant1-button');
 * console.log(test('text'), '---98A');
 * console.log(test({ disabled : 'disabled' }), '---98B');
 * console.log(test('text', { disabled : 'disabled' }), '---98C');
 * console.log(test(['disabled', 'primary']), '---98D');
 * vant1-button__text ---98A
 * vant1-button vant1-button--disabled ---98B
 * vant1-button__text vant1-button__text--disabled ---98C
 * vant1-button vant1-button--disabled vant1-button--primary ---98D
 */

export type Mod = string | { [key: string]: any };
export type Mods = Mod | Mod[];

function gen(name: string, mods?: Mods): string {
  if (!mods) {
    return '';
  }

  if (typeof mods === 'string') {
    return ` ${name}--${mods}`;
  }

  if (Array.isArray(mods)) {
    // TODO: TS: 注解
    // 递归调用 拼接class van-button--primary
    return mods.reduce<string>((ret, item) => ret + gen(name, item), '');
  }
  return Object.keys(mods).reduce(
    (ret, key) => ret + (mods[key] ? gen(name, key) : ''),
    ''
  );
}

export function createBEM(name: string) {
  return function (el?: Mods, mods?: Mods): Mods {
    // TODO: TS: 注解
    // 这个不就是参数各种判断 字符串 ，对象, 字符的数组 对象的数组，各种移动
    if (el && typeof el !== 'string') {
      mods = el;
      el = '';
    }

    el = el ? `${name}__${el}` : name;
    return `${el}${gen(el, mods)}`;
  };
}

// TODO: TS注解
// TS 高级类型 ReturnType - 条件类型 ReturnType<T> -- 获取函数返回值类型。
export type BEM = ReturnType<typeof createBEM>;
