/**
 * create_child_note
 * Crea una nota hija numerada a partir de la nota activa (padre).
 * Detecta automáticamente el patrón BOARD-NUMBER para construir los links de contexto.
 *
 * @param {object} tp        - Objeto Templater
 * @param {object} config
 * @param {string} config.parentFolder - Fragmento de ruta que debe contener el padre
 * @param {string} config.childFolder  - Carpeta raíz donde se crean las hijas (sin trailing slash)
 * @param {string} [config.separator]  - Separador entre el nombre del padre y el índice (por defecto "-")
 *
 * @returns {{ title: string, context: string }}
 *   title   — nombre calculado para la nota hija (ej. "MAIN-10-1")
 *   context — string listo para añadir a tR con el atributo context del frontmatter
 */
module.exports = async (tp, config) => {
  const { parentFolder, childFolder, separator = "-" } = config;

  const parentFile = tp.config.active_file;
  const parent = (parentFile && parentFile.path.includes(parentFolder))
    ? parentFile.basename
    : "";

  if (!parent) {
    return { title: tp.file.title, context: "" };
  }

  // Rename the new child note
  const prefix = `${parent}${separator}`;
  const existing = app.vault.getFiles().filter(f =>
    f.path.startsWith(childFolder + "/") && f.basename.startsWith(prefix)
  );
  const title = `${prefix}${existing.length + 1}`;
  await tp.file.rename(title);

  // Switch to preview when Meta Bind opens the new note
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

  // Build context links — detect BOARD-NUMBER pattern to include ancestor
  const links = [];
  const boardMatch = parent.match(/^(.+)-\d+$/);
  if (boardMatch) links.push(boardMatch[1]);
  links.push(parent);

  const contextAttr = await tp.file.include("[[c_templater_native_context_attribute]]");
  const context = contextAttr + links.map(t => `\n- "[[${t}]]"`).join("");

  return { title, context };
};

