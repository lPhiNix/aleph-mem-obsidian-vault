<%*
// Guard against duplicate template application on Windows.
// The vault 'create' event fires twice on Windows; both invocations pass
// Templater's built-in check simultaneously, causing the body to be written twice.
// Fix: find the Templater instance by searching the plugin's own properties,
// then patch both write_template_to_file AND overwrite_file_commands with a
// per-file mutex so only the first invocation proceeds.
(function() {
    const p = app.plugins.plugins['templater-obsidian'];
    if (!p) { console.error('[guard] templater-obsidian plugin not found'); return; }

    // Find the object that has write_template_to_file (the Templater class instance)
    let t = null;
    for (const key of Object.keys(p)) {
        const v = p[key];
        if (v && typeof v === 'object' && typeof v.write_template_to_file === 'function') {
            t = v; break;
        }
    }
    if (!t) { console.error('[guard] Templater instance not found on plugin object'); return; }
    if (t.__guard_patched) return;

    const guard = new Set();
    const TTL = 15000; // ms to hold the lock after file creation

    // Patch write_template_to_file (called when file is empty on creation)
    const origWrite = t.write_template_to_file.bind(t);
    t.write_template_to_file = async function(templateFile, targetFile) {
        const key = targetFile?.path ?? '';
        if (!key || guard.has(key)) return;
        guard.add(key);
        try { return await origWrite(templateFile, targetFile); }
        finally { setTimeout(() => guard.delete(key), TTL); }
    };

    // Patch overwrite_file_commands (called when file already has content on creation)
    const origOverwrite = t.overwrite_file_commands.bind(t);
    t.overwrite_file_commands = async function(file, active = false) {
        const key = file?.path ?? '';
        if (key && guard.has(key)) return; // second invocation saw non-empty file
        return await origOverwrite(file, active);
    };

    t.__guard_patched = true;
    console.log('[guard] Templater double-write guard applied successfully');
})();
%>
