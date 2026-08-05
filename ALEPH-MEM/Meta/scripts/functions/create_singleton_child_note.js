/**
 * create_singleton_child
 * Thin wrapper around child_note_factory.singletonChild.
 * Creates a 1-1 child note with a fixed suffix (no auto-numbering).
 *
 * Config: { parentFolder, suffix }
 * Returns: { title, context, renamed }
 */
const factory = (() => {
  try { return require('./child_note_factory.js'); }
  catch (_) { return globalThis.__childNoteFactory; }
})();

module.exports = factory.singletonChild;
