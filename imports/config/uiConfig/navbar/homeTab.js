const homeTab = onHomeNav => ({
	key: "homeTab",
	name: "Home",
	cacheKey: "homeTabCacheKey", // changing this key will invalidate this items cache
	iconProps: {
		iconName: "Home",
	},
	onClick: onHomeNav,
});

export default homeTab;
