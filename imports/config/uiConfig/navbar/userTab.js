const userCommandBarItems = (name, settingOnClick, handleLogout) => [
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
					onClick: handleLogout,
				},
			],
		},
	},
];

export default userCommandBarItems;
