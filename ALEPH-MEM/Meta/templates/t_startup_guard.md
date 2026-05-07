<%*
// Guard against duplicate template application on Windows.
// Debounces the vault 'create' event so only one on_file_creation runs per file.
(function() {
    const p = app.plugins.plugins['templater-obsidian'];
    if (!p) { console.error('[guard] plugin not found'); return; }

    // Find the Templater class instance (has write_template_to_file)
    let templater = null;
    for (const k of Object.keys(p)) {
        const v = p[k];
        if (v && typeof v === 'object' && typeof v.write_template_to_file === 'function') {
            templater = v; break;
        }
    }
    if (!templater) { console.error('[guard] templater instance not found'); return; }

    // Find the event handler (has update_trigger_file_on_creation)
    let evHandler = null;
    for (const k of Object.keys(p)) {
        const v = p[k];
        if (v && typeof v === 'object' && typeof v.update_trigger_file_on_creation === 'function') {
            evHandler = v; break;
        }
    }
    if (!evHandler) { console.error('[guard] event handler not found'); return; }
    if (evHandler.__guard_patched) { console.log('[guard] Already patched, skipping'); return; }

    // Get the static on_file_creation method from the constructor
    const TemplaterClass = templater.constructor;
    if (typeof TemplaterClass.on_file_creation !== 'function') {
        console.error('[guard] static on_file_creation not found on constructor');
        return;
    }

    // Unregister the existing vault 'create' listener
    if (evHandler.trigger_on_file_creation_event) {
        app.vault.offref(evHandler.trigger_on_file_creation_event);
        console.log('[guard] Removed original vault create listener');
    }

    // Register debounced replacement: only allow one on_file_creation per file per 5s
    const seen = new Map();
    const DEBOUNCE_MS = 5000;

    evHandler.trigger_on_file_creation_event = app.vault.on('create', (file) => {
        const now = Date.now();
        const last = seen.get(file.path) ?? 0;
        if (now - last < DEBOUNCE_MS) {
            console.log('[guard] Blocked duplicate create event for:', file.path);
            return;
        }
        seen.set(file.path, now);
        TemplaterClass.on_file_creation(templater, app, file);
    });
    p.registerEvent(evHandler.trigger_on_file_creation_event);

    evHandler.__guard_patched = true;
    console.log('[guard] Vault create event debounced successfully');
})();
%>
