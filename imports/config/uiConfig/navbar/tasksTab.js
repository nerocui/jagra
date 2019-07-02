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
				onClick: () => navToTasklist("tasksAssignedToMe"),
			},
			{
				key: "tasksCreatedByMe",
				name: "Created By Me",
				iconProps: {
					iconName: "AddFriend",
				},
				onClick: () => navToTasklist("tasksCreatedByMe"),
			},
			{
				key: "tasksIAmWatching",
				name: "Watch List",
				iconProps: {
					iconName: "Glasses",
				},
				onClick: () => navToTasklist("tasksIAmWatching"),
			},
			{
				key: "teamTasks",
				name: "Team Tasks",
				iconProps: {
					iconName: "Teamwork",
				},
				onClick: () => navToTasklist("teamTasks"),
			},
			{
				key: "allTasks",
				name: "All Tasks",
				iconProps: {
					iconName: "AllApps",
				},
				onClick: () => navToTasklist("allTasks"),
			},
		],
	},
});

export default tasksTab;
