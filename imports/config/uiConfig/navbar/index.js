import homeTab from "./homeTab";
import taskTab from "./tasksTab";
import commentsTab from "./commentsTab";
import filesTab from "./filesTab";
import employeesTab from "./employeesTab";
import dashboardTab from "./dashboardsTab";

const navItems = (onHomeNav, onAdminNav, onEmployeeNav, navToTasklist) => [
	homeTab(onHomeNav),
	taskTab(navToTasklist),
	commentsTab,
	filesTab,
	employeesTab,
	dashboardTab(onAdminNav, onEmployeeNav),
];

export default navItems;
