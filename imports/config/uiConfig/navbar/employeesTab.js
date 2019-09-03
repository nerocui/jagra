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

export default employeesTab;
