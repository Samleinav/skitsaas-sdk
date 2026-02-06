import type {
  EventDispatchResult,
  EventEmitContext,
  EventHook,
  EventPayload
} from './events/types';

export type EventEmitterAdapter = {
  emitEvent: <TPayload extends EventPayload>(
    hook: EventHook,
    payload: TPayload,
    context?: EventEmitContext
  ) => Promise<EventDispatchResult>;
  emitEventAsync?: <TPayload extends EventPayload>(
    hook: EventHook,
    payload: TPayload,
    context?: EventEmitContext
  ) => Promise<EventDispatchResult>;
};

let eventEmitterAdapter: EventEmitterAdapter | null = null;

export function configureEventEmitter(adapter: EventEmitterAdapter) {
  eventEmitterAdapter = adapter;
}

export async function emitEvent<TPayload extends EventPayload>(
  hook: EventHook,
  payload: TPayload,
  context?: EventEmitContext
): Promise<EventDispatchResult> {
  if (!eventEmitterAdapter) {
    throw new Error('Module SDK event emitter not configured.');
  }

  return eventEmitterAdapter.emitEvent(hook, payload, context);
}

export async function emitEventAsync<TPayload extends EventPayload>(
  hook: EventHook,
  payload: TPayload,
  context?: EventEmitContext
): Promise<EventDispatchResult> {
  if (!eventEmitterAdapter) {
    throw new Error('Module SDK event emitter not configured.');
  }

  if (eventEmitterAdapter.emitEventAsync) {
    return eventEmitterAdapter.emitEventAsync(hook, payload, context);
  }

  return eventEmitterAdapter.emitEvent(hook, payload, context);
}

export type ModuleConfigAdapter = {
  getConfigValue: (namespace: string, configKey: string) => Promise<string | null>;
  setConfigValue: (
    namespace: string,
    configKey: string,
    configValue: string
  ) => Promise<void>;
};

let moduleConfigAdapter: ModuleConfigAdapter | null = null;

export function configureModuleConfig(adapter: ModuleConfigAdapter) {
  moduleConfigAdapter = adapter;
}

export async function getModuleConfigValue(
  namespace: string,
  configKey: string
) {
  if (!moduleConfigAdapter) {
    throw new Error('Module SDK config adapter not configured.');
  }

  return moduleConfigAdapter.getConfigValue(namespace, configKey);
}

export async function setModuleConfigValue(
  namespace: string,
  configKey: string,
  configValue: string
) {
  if (!moduleConfigAdapter) {
    throw new Error('Module SDK config adapter not configured.');
  }

  return moduleConfigAdapter.setConfigValue(namespace, configKey, configValue);
}

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

type ControllerAction<TUser> = (
  context: ControllerContext<TUser>
) => Promise<void | boolean>;

type ControllerOptions<TUser> = {
  requireUser: () => Promise<TUser>;
};

type ActionOptions = {
  revalidate?: RevalidateHandler | RevalidateHandler[];
};

function normalizeString(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function createFormReader(formData: FormData): FormReader {
  return {
    value(field) {
      return formData.get(field);
    },
    string(field) {
      return normalizeString(formData.get(field));
    },
    lower(field) {
      return normalizeString(formData.get(field)).toLowerCase();
    },
    number(field) {
      const raw = normalizeString(formData.get(field));
      if (!raw) {
        return null;
      }

      const parsed = Number(raw);
      return Number.isNaN(parsed) ? null : parsed;
    },
    integer(field) {
      const parsed = this.number(field);
      if (parsed === null || !Number.isInteger(parsed)) {
        return null;
      }

      return parsed;
    },
    positiveInt(field) {
      const parsed = this.integer(field);
      if (parsed === null || parsed <= 0) {
        return null;
      }

      return parsed;
    },
    strings(field) {
      return formData
        .getAll(field)
        .map((entry) => normalizeString(entry))
        .filter(Boolean);
    }
  };
}

function runRevalidation(revalidate?: RevalidateHandler | RevalidateHandler[]) {
  if (!revalidate) {
    return;
  }

  const handlers = Array.isArray(revalidate) ? revalidate : [revalidate];
  for (const handler of handlers) {
    handler();
  }
}

export function createServerActionController<TUser>({
  requireUser
}: ControllerOptions<TUser>) {
  return function withController(
    handler: ControllerAction<TUser>,
    options?: ActionOptions
  ) {
    return async function controlledAction(formData: FormData) {
      const user = await requireUser();
      const result = await handler({
        user,
        formData,
        form: createFormReader(formData)
      });

      if (result === false) {
        return;
      }

      runRevalidation(options?.revalidate);
    };
  };
}
