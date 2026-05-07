<%*
// Fix: prevent double template application on Windows
// Root cause: vault 'create' event fires twice → both calls pass the
// files_with_pending_templates check simultaneously → body duplicated.
// This patches write_template_to_file with a proper per-file guard.
const plugin = app.plugins.plugins['templater-obsidian'];
if (plugin && plugin.templater && !plugin.templater.__write_guard_patched) {
  const orig = plugin.templater.write_template_to_file.bind(plugin.templater);
  const _running = new Set();
  plugin.templater.write_template_to_file = async function(template_file, target_file) {
    const key = target_file?.path ?? "";
    if (!key || _running.has(key)) return;
    _running.add(key);
    try { 
	return await orig(template_file, target_file);
    }
    finally { 
	setTimeout(() => _running.delete(key), 10000); 
    }
  };
  plugin.templater.__write_guard_patched = true;
}
%>
