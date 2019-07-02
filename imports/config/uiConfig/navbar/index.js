import homeTab from "./homeTab";
import taskTab from "./tasksTab";
import commentsTab from "./commentsTab";
import filesTab from "./filesTab";
import employeesTab from "./employeesTab";
import dashboardTab from "./dashboardsTab";
import newTaskButton from "./newTaskButton";

const navItems = (onHomeNav, onAdminNav, onEmployeeNav, navToTasklist, openNewTaskModal) => [
	homeTab(onHomeNav),
	taskTab(navToTasklist),
	commentsTab,
	filesTab,
	employeesTab,
	dashboardTab(onAdminNav, onEmployeeNav),
	newTaskButton(openNewTaskModal),
];

export default navItems;
