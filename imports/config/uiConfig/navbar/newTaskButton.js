const newTaskButton = openNewTaskModal => ({
	key: "newTaskButton",
	name: "New Task",
	cacheKey: "newTaskCacheKey", // changing this key will invalidate this items cache
	iconProps: {
		iconName: "Add",
	},
	onClick: openNewTaskModal,
});

export default newTaskButton;
