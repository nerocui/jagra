//Auth
const NOT_AUTH = "Not signed in",
	NO_PRIVILEGE = "No privilege",
	//Task
	INVALID_TASK_ASSIGNEE = "The target assignee is invalid",
	TASK_INSERT_FAIL = "Failed to create task",
	TASK_REMOVE_COMMENT_FAIL = "Failed to remove comment",
	TASK_DOES_NOT_EXIST = "Task does not exist",
	TASK_NOT_UNWATCHABLE = "Cannot unwatch task",
	TASK_NOT_WATCHABLE = "Cannot watch task",
	TASK_ASSIGN_FAIL = "Failed to assign task";

export const AuthError = {
	NOT_AUTH,
	NO_PRIVILEGE,
};

export const TaskError = {
	INVALID_TASK_ASSIGNEE,
	TASK_INSERT_FAIL,
	TASK_REMOVE_COMMENT_FAIL,
	TASK_DOES_NOT_EXIST,
	TASK_NOT_UNWATCHABLE,
	TASK_NOT_WATCHABLE,
	TASK_ASSIGN_FAIL,
};
