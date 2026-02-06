import type { EventDispatchResult, EventEmitContext, EventHook, EventPayload } from './events/types';
export type EventEmitterAdapter = {
    emitEvent: <TPayload extends EventPayload>(hook: EventHook, payload: TPayload, context?: EventEmitContext) => Promise<EventDispatchResult>;
    emitEventAsync?: <TPayload extends EventPayload>(hook: EventHook, payload: TPayload, context?: EventEmitContext) => Promise<EventDispatchResult>;
};
export declare function configureEventEmitter(adapter: EventEmitterAdapter): void;
export declare function emitEvent<TPayload extends EventPayload>(hook: EventHook, payload: TPayload, context?: EventEmitContext): Promise<EventDispatchResult>;
export declare function emitEventAsync<TPayload extends EventPayload>(hook: EventHook, payload: TPayload, context?: EventEmitContext): Promise<EventDispatchResult>;
export type ModuleConfigAdapter = {
    getConfigValue: (namespace: string, configKey: string) => Promise<string | null>;
    setConfigValue: (namespace: string, configKey: string, configValue: string) => Promise<void>;
};
export declare function configureModuleConfig(adapter: ModuleConfigAdapter): void;
export declare function getModuleConfigValue(namespace: string, configKey: string): Promise<string | null>;
export declare function setModuleConfigValue(namespace: string, configKey: string, configValue: string): Promise<void>;
type RevalidateHandler = () => void;
type FormReader = {
    value: (field: string) => FormDataEntryValue | null;
    string: (field: string) => string;
    lower: (field: string) => string;
    number: (field: string) => number | null;
    integer: (field: string) => number | null;
    positiveInt: (field: string) => number | null;
    strings: (field: string) => string[];
};
export type ControllerContext<TUser> = {
    user: TUser;
    formData: FormData;
    form: FormReader;
};
type ControllerAction<TUser> = (context: ControllerContext<TUser>) => Promise<void | boolean>;
type ControllerOptions<TUser> = {
    requireUser: () => Promise<TUser>;
};
type ActionOptions = {
    revalidate?: RevalidateHandler | RevalidateHandler[];
};
export declare function createServerActionController<TUser>({ requireUser }: ControllerOptions<TUser>): (handler: ControllerAction<TUser>, options?: ActionOptions) => (formData: FormData) => Promise<void>;
export {};
