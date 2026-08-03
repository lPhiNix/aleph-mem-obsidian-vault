/**
 * create_devs_singleton_child
 * Renames a 1-1 child note (Postmortem) to its canonical name.
 * Does NOT auto-number — the name is fixed (e.g., PROJECT-1-PM).
 * If the target name already exists, the rename is skipped.
 *
 * @param {object} tp           - Templater object
 * @param {object} config
 * @param {string} config.parentFolder - Fragment of path that the parent must contain
 * @param {string} config.suffix       - Suffix to append (e.g., "-PM")
 *
 * @returns {{ title: string, context: string }}
 */
module.exports = async (tp, config) => {
  const { parentFolder, suffix } = config;

  const parentFile = tp.config.active_file;
  const parent = (parentFile && parentFile.path.includes(parentFolder))
    ? parentFile.basename
    : "";

  if (!parent) {
    return { title: tp.file.title, context: "" };
  }

  const title = `${parent}${suffix}`;

  const alreadyExists = app.vault.getFiles().some(
    f => f.basename === title && f !== tp.config.target_file
  );

  if (!alreadyExists) {
    await tp.file.rename(title);
  }

  const contextAttr = await tp.file.include("[[c_templater_native_context_attribute]]");
  const context = contextAttr + `\n- "[[${parent}]]"`;

  return { title, context };
};
