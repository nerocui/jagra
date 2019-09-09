const dashboardsTab = (onAdminNav, onEmployeeNav) => ({
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

export default dashboardsTab;
