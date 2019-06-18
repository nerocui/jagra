const taskTab = {
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
};
const commentsTab = {
	key: "commentsTab",
	name: "Comments",
	iconProps: {
		iconName: "Comment",
	},
	"data-automation-id": "uploadButton",
	subMenuProps: {
		items: [
			{
				key: "myComments",
				name: "My Comments",
				iconProps: {
					iconName: "Mail",
				},
				"data-automation-id": "newEmailButton",
			},
			{
				key: "repliesComment",
				name: "Replies Comments",
				iconProps: {
					iconName: "MailReply",
				},
			},
			{
				key: "teamComments",
				name: "Team Comments",
				iconProps: {
					iconName: "ConnectContacts",
				},
			},
		],
	},
};

const dashboardTab = (onAdminNav, onEmployeeNav) => ({
	key: "dashboardTab",
	name: "Dashboards(Dev Only)",
	cacheKey: "dashboardTabCacheKey", // changing this key will invalidate this items cache
	iconProps: {
		iconName: "ViewDashboard",
	},
	ariaLabel: "Dashboards",
	subMenuProps: {
		items: [
			{
				key: "adminDashboard",
				name: "Admin",
				iconProps: {
					iconName: "Admin",
				},
				onClick: onAdminNav,
			},
			{
				key: "employeeDashboard",
				name: "Employee Center",
				iconProps: {
					iconName: "GridViewSmall",
				},
				onClick: onEmployeeNav,
			},
		],
	},
});

const filesTab = {
	key: "filesTab",
	name: "Files",
	iconProps: {
		iconName: "Documentation",
	},
	subMenuProps: {
		items: [
			{
				key: "myFiles",
				name: "My Files",
				iconProps: {
					iconName: "UserFollowed",
				},
				"data-automation-id": "newEmailButton",
			},
			{
				key: "teamFiles",
				name: "Team Files",
				iconProps: {
					iconName: "People",
				},
			},
		],
	},
};

const employeesTab = {
	key: "employeesTab",
	name: "Employees",
	iconProps: {
		iconName: "People",
	},
	subMenuProps: {
		items: [
			{
				key: "teamMember",
				name: "Team Member",
				iconProps: {
					iconName: "Teamwork",
				},
				"data-automation-id": "newEmailButton",
			},
			{
				key: "managers",
				name: "Managers",
				iconProps: {
					iconName: "WorkforceManagement",
				},
			},
			{
				key: "subordinates",
				name: "Subordinates",
				iconProps: {
					iconName: "People",
				},
			},
		],
	},
};

export const navItems = (onAdminNav, onEmployeeNav) => [
	taskTab,
	commentsTab,
	filesTab,
	employeesTab,
	dashboardTab(onAdminNav, onEmployeeNav),
];

export const userCommandBarItems = (name, settingOnClick) => [
	{
		key: "userTab",
		name,
		cacheKey: "userTabCacheKey", // changing this key will invalidate this items cache
		iconProps: {
			iconName: "Contact",
		},
		ariaLabel: "User Settings",
		subMenuProps: {
			items: [
				{
					key: "userProfile",
					name: "Profile",
					iconProps: {
						iconName: "ContactInfo",
					},
					"data-automation-id": "newEmailButton",
				},
				{
					key: "accountSettings",
					name: "Settings",
					iconProps: {
						iconName: "Settings",
					},
					onClick: settingOnClick,
				},
				{
					key: "logOut",
					name: "Log Out",
					iconProps: {
						iconName: "Leave",
					},
				},
			],
		},
	},
];
