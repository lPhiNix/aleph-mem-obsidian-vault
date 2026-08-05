/**
 * generate_child_note
 * Creates a child note from the active parent. Detects mode from config:
 *   - numbered: config.childFolder → auto-numbered (e.g. PROJECT-1-B1)
 *   - singleton: config.suffix → fixed name (e.g. PROJECT-1-PM)
 *
 * @param {object} tp     — Templater object
 * @param {object} config
 * @param {string} config.parentFolder  — fragment that the parent's path must contain
 * @param {string} [config.childFolder]  — numbered mode: folder where child is created
 * @param {string} [config.separator]    — numbered mode: separator (default "-")
 * @param {boolean} [config.includeBoard] — numbered mode: include ancestor board (default true)
 * @param {string} [config.suffix]       — singleton mode: suffix to append (e.g. "-PM")
 *
 * @returns {object}
 *   numbered:  { title: string, context: string }
 *   singleton: { title: string, context: string, renamed: boolean }
 */

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function getParentName(tp, parentFolder) {
  const parentFile = tp.config.active_file;
  if (!parentFile || !parentFile.path.includes(parentFolder)) return "";
  return parentFile.basename;
}

async function buildContext(tp, parentLinks) {
  const attr = await tp.file.include("[[c_templater_native_context_attribute]]");
  if (!parentLinks || parentLinks.length === 0) return attr;
  return attr + parentLinks.map(link => `\n- "[[${link}]]"`).join("");
}

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

async function numbered(tp, config) {
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

async function singleton(tp, config) {
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
// Auto-detect mode
// ---------------------------------------------------------------------------

module.exports = async (tp, config) => {
  if (config.suffix) {
    return await singleton(tp, config);
  }
  return await numbered(tp, config);
};
