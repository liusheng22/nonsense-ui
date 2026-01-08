import type { App, Plugin } from "vue";

export type SFCWithInstall<T> = T & Plugin;

export function withInstall<T extends { name?: string }>(
  component: T
): SFCWithInstall<T> {
  const componentName = component.name;
  if (!componentName) return component as SFCWithInstall<T>;

  (component as SFCWithInstall<T>).install = (app: App) => {
    app.component(componentName, component as any);
  };

  return component as SFCWithInstall<T>;
}

