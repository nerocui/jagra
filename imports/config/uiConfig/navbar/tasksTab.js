const tasksTab = navToTasklist => ({
	key: "tasksTab",
	name: "Tasks",
	cacheKey: "tasksTabCacheKey", // changing this key will invalidate this items cache
	iconProps: {
		iconName: "TaskManager",
	},
	ariaLabel: "Tasks",
	subMenuProps: {
		items: [
			{
				key: "tasksAssignedToMe",
				name: "Assigned To Me",
				iconProps: {
					iconName: "Assign",
				},
				onClick: navToTasklist,
			},
			{
				key: "tasksCreatedByMe",
				name: "Created By Me",
				iconProps: {
					iconName: "AddFriend",
				},
			},
			{
				key: "tasksIAmWatching",
				name: "Watch List",
				iconProps: {
					iconName: "Glasses",
				},
			},
			{
				key: "teamTasks",
				name: "Team Tasks",
				iconProps: {
					iconName: "Teamwork",
				},
			},
			{
				key: "allTasks",
				name: "All Tasks",
				iconProps: {
					iconName: "AllApps",
				},
			},
		],
	},
});

export default tasksTab;
