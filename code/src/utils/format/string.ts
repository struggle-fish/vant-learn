const camelizeRE = /-(\w)/g;
// TODO: TS注解
// 连字符 - 转驼峰  on-click => onClick
export function camelize(str: string): string {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}

export function padZero(num: number | string, targetLength = 2): string {
  let str = num + '';

  while (str.length < targetLength) {
    str = '0' + str;
  }

  return str;
}
