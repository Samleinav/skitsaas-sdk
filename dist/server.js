let eventEmitterAdapter = null;
export function configureEventEmitter(adapter) {
    eventEmitterAdapter = adapter;
}
export async function emitEvent(hook, payload, context) {
    if (!eventEmitterAdapter) {
        throw new Error('Module SDK event emitter not configured.');
    }
    return eventEmitterAdapter.emitEvent(hook, payload, context);
}
export async function emitEventAsync(hook, payload, context) {
    if (!eventEmitterAdapter) {
        throw new Error('Module SDK event emitter not configured.');
    }
    if (eventEmitterAdapter.emitEventAsync) {
        return eventEmitterAdapter.emitEventAsync(hook, payload, context);
    }
    return eventEmitterAdapter.emitEvent(hook, payload, context);
}
let moduleConfigAdapter = null;
export function configureModuleConfig(adapter) {
    moduleConfigAdapter = adapter;
}
export async function getModuleConfigValue(namespace, configKey) {
    if (!moduleConfigAdapter) {
        throw new Error('Module SDK config adapter not configured.');
    }
    return moduleConfigAdapter.getConfigValue(namespace, configKey);
}
export async function setModuleConfigValue(namespace, configKey, configValue) {
    if (!moduleConfigAdapter) {
        throw new Error('Module SDK config adapter not configured.');
    }
    return moduleConfigAdapter.setConfigValue(namespace, configKey, configValue);
}
function normalizeString(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim();
}
function createFormReader(formData) {
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
function runRevalidation(revalidate) {
    if (!revalidate) {
        return;
    }
    const handlers = Array.isArray(revalidate) ? revalidate : [revalidate];
    for (const handler of handlers) {
        handler();
    }
}
export function createServerActionController({ requireUser }) {
    return function withController(handler, options) {
        return async function controlledAction(formData) {
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
