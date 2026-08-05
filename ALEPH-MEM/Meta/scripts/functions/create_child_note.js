/**
 * create_child_note
 * Thin wrapper around child_note_factory.numberedChild.
 * Creates an auto-numbered child note from the active parent.
 *
 * Config: { parentFolder, childFolder, separator?, includeBoard? }
 * Returns: { title, context }
 */
const factory = (() => {
  try { return require('./child_note_factory.js'); }
  catch (_) { return globalThis.__childNoteFactory; }
})();

module.exports = factory.numberedChild;
