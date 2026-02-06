export { EVENT_HOOKS } from './events/catalog';
export type { EventHook } from './events/catalog';
export type { EventPayload, ModuleEventContext, EventEmitContext, ModuleEventHandler, RegisteredEventHandler, EventEnvelope, EventDispatchResult } from './events/types';
export type { ModuleArea, ModuleNavArea, ModuleNavItem, ModuleWidgetDefinition, ModuleRouteContext, ModulePageHandler, ModuleApiHandler, ModuleManifest } from './modules/manifest';
export { defineModule, validateModuleManifest } from './modules/manifest';
export type { ModuleI18nNamespace, ModuleMessageTree, ModuleMessagesByLocale, ModuleMessagesByArea } from './i18n/types';
