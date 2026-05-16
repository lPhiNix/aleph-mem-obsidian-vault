<%*
const _targetFile = tp.config.target_file;
tp.hooks.on_all_templates_executed(async () => {
  const leaf = app.workspace.getMostRecentLeaf();
  if (!leaf || leaf.view?.file !== _targetFile) return;
  const state = leaf.getViewState();
  await leaf.setViewState({ ...state, state: { ...state.state, mode: "preview" } });
});
%>