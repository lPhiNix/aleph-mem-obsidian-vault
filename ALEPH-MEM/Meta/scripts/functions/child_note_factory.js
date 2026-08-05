/**
 * child_note_factory
 * Shared utilities and strategies for creating child notes in any module.
 *
 * Strategies:
 *   numberedChild  — 1-n relationships, auto-numbered (Binnacle, Decision, Subtask)
 *   singletonChild — 1-1 relationships, fixed name (Postmortem)
 *
 * Use from templates via thin wrappers (create_child_note.js, create_singleton_child.js).
 */

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Extracts the parent basename from Templater's active file, validated against a folder.
 * @param {object} tp
 * @param {string} parentFolder — fragment that the parent's path must contain
 * @returns {string} parent basename, or "" if not found
 */
function getParentName(tp, parentFolder) {
  const parentFile = tp.config.active_file;
  if (!parentFile || !parentFile.path.includes(parentFolder)) return "";
  return parentFile.basename;
}

/**
 * Builds the `context` frontmatter attribute string from a list of parent link names.
 * @param {string} contextAttr — result of tp.file.include("[[c_templater_native_context_attribute]]")
 * @returns {string} full context attribute ready for tR
 */
async function buildContext(tp, parentLinks) {
  const attr = await tp.file.include("[[c_templater_native_context_attribute]]");
  if (!parentLinks || parentLinks.length === 0) return attr;
  return attr + parentLinks.map(link => `\n- "[[${link}]]"`).join("");
}

/**
 * Scans a folder for files matching a prefix and returns max index + 1.
 * @param {string} childFolder — folder to scan (e.g. "04 - Λ - Devs/02 - Binnacles")
 * @param {string} prefix      — basename prefix to match (e.g. "PROJECT-1-B")
 * @returns {number} next available index
 */
function getNextIndex(childFolder, prefix) {
  const existing = app.vault.getFiles().filter(f =>
    f.path.startsWith(childFolder + "/") && f.basename.startsWith(prefix)
  );
  let maxN = 0;
  existing.forEach(f => {
    const num = parseInt(f.basename.replace(prefix, ""));
    if (!isNaN(num) && num > maxN) maxN = num;
  });
  return maxN + 1;
}

/**
 * Forces preview mode when the child note is opened. Duplicates what the
 * native preview_mode_forcer component does — kept here as a safeguard.
 */
function forcePreview(tp) {
  const _newFile = tp.config.target_file;
  let _handled = false;
  const _switchToPreview = () => {
    if (_handled) return;
    let targetLeaf = null;
    app.workspace.iterateAllLeaves(leaf => {
      if (leaf.view?.file === _newFile) targetLeaf = leaf;
    });
    if (!targetLeaf) return;
    _handled = true;
    app.workspace.offref(_handler);
    const state = targetLeaf.getViewState();
    targetLeaf.setViewState({ ...state, state: { ...state.state, mode: "preview" } });
  };
  const _handler = app.workspace.on("file-open", (openedFile) => {
    if (openedFile === _newFile) _switchToPreview();
  });
  setTimeout(_switchToPreview, 800);
}

// ---------------------------------------------------------------------------
// Strategies
// ---------------------------------------------------------------------------

/**
 * Creates an auto-numbered child note (1-n relationship).
 * Renames to {parent}{separator}{N} (e.g. PROJECT-1-B1).
 *
 * Config shape:
 *   { parentFolder, childFolder, separator?, includeBoard? }
 *
 * @param {object} tp     — Templater object
 * @param {object} config
 * @returns {{ title: string, context: string }}
 */
async function numberedChild(tp, config) {
  const { parentFolder, childFolder, separator = "-", includeBoard = true } = config;

  const parent = getParentName(tp, parentFolder);
  if (!parent) {
    return { title: tp.file.title, context: "" };
  }

  const prefix = `${parent}${separator}`;
  const nextIndex = getNextIndex(childFolder, prefix);
  const title = `${prefix}${nextIndex}`;
  await tp.file.rename(title);

  forcePreview(tp);

  const links = [];
  if (includeBoard) {
    const boardMatch = parent.match(/^(.+)-\d+$/);
    if (boardMatch) links.push(boardMatch[1]);
  }
  links.push(parent);

  const context = await buildContext(tp, links);

  return { title, context };
}

/**
 * Creates a 1-1 singleton child note with a fixed suffix.
 * Renames to {parent}{suffix} (e.g. PROJECT-1-PM).
 * If the target already exists, rename is skipped.
 *
 * Config shape:
 *   { parentFolder, suffix }
 *
 * @param {object} tp     — Templater object
 * @param {object} config
 * @returns {{ title: string, context: string, renamed: boolean }}
 */
async function singletonChild(tp, config) {
  const { parentFolder, suffix } = config;

  const parent = getParentName(tp, parentFolder);
  if (!parent) {
    return { title: tp.file.title, context: "", renamed: false };
  }

  const title = `${parent}${suffix}`;

  const alreadyExists = app.vault.getFiles().some(
    f => f.basename === title && f !== tp.config.target_file
  );

  if (!alreadyExists) {
    await tp.file.rename(title);
  }

  const context = await buildContext(tp, [parent]);

  return { title, context, renamed: !alreadyExists };
}

// ---------------------------------------------------------------------------
// Exports (for require()) and global fallback
// ---------------------------------------------------------------------------

module.exports = { getParentName, getNextIndex, buildContext, numberedChild, singletonChild };

// Global fallback — some Templater setups may not support require().
// Thin wrappers check this first.
globalThis.__childNoteFactory = module.exports;
