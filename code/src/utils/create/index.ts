import { createBEM, BEM } from './bem';
import { createComponent } from './component';
import { createI18N, Translate } from './i18n';
// TODO: TS注解
// type 声明对象用 元祖
type CreateNamespaceReturn = [
  ReturnType<typeof createComponent>,
  BEM,
  Translate
];

// TODO: TS注解
// 创建命名空间
export function createNamespace(name: string): CreateNamespaceReturn {
  name = 'van-' + name;
  return [createComponent(name), createBEM(name), createI18N(name)];
}
