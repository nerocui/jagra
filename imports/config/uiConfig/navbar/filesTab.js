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

export default filesTab;
