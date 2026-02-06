export function defineModule(manifest) {
    return manifest;
}
export function validateModuleManifest(manifest) {
    const errors = [];
    if (!manifest.moduleId || !manifest.moduleId.trim()) {
        errors.push('module_id_missing');
    }
    if (!manifest.version || !manifest.version.trim()) {
        errors.push('module_version_missing');
    }
    if (!manifest.displayName || !manifest.displayName.trim()) {
        errors.push('module_display_name_missing');
    }
    return errors;
}
