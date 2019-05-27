//Auth
const NOT_AUTH = "Not signed in",
	NO_PRIVILEGE = "No privilege",
	//Task
	INVALID_TASK_ASSIGNEE = "The target assignee is invalid",
	TASK_INSERT_FAIL = "Failed to create task",
	TASK_REMOVE_FAIL = "Failed to remove task",
	TASK_REMOVE_COMMENT_FAIL = "Failed to remove comment",
	TASK_DOES_NOT_EXIST = "Task does not exist",
	TASK_NOT_UNWATCHABLE = "Cannot unwatch task",
	TASK_NOT_WATCHABLE = "Cannot watch task",
	TASK_ASSIGN_FAIL = "Failed to assign task",
	//Comment
	COMMENT_INSERT_FAIL = "Failed to create comment",
	COMMENT_REMOVE_FAIL = "Failed to remove comment",
	COMMENT_NOT_EXIST = "Comment does not exist",
	COMMENT_EDIT_FAIL = "Failed to edit comment",
	COMMENT_REPLY_FAIL = "Failed to reply to comment",
	//Logs
	LOG_INSERT_FAIL = "Failed to create log",
	LOG_REMOVE_FAIL = "Failed to remove log";
	//Employee
	EMPLOYEE_INSERT_FAIL = "Failed to create employee";
	EMPLOYEE_NOT_EXIST = "Employee does not exist";
	EMPLOYEE_REMOVE_FAIL = "Failed to remove employee";

export const AuthError = {
	NOT_AUTH,
	NO_PRIVILEGE,
};

export const TaskError = {
	INVALID_TASK_ASSIGNEE,
	TASK_INSERT_FAIL,
	TASK_REMOVE_FAIL,
	TASK_REMOVE_COMMENT_FAIL,
	TASK_DOES_NOT_EXIST,
	TASK_NOT_UNWATCHABLE,
	TASK_NOT_WATCHABLE,
	TASK_ASSIGN_FAIL,
};

export const CommentError = {
	COMMENT_INSERT_FAIL,
	COMMENT_REMOVE_FAIL,
	COMMENT_NOT_EXIST,
	COMMENT_EDIT_FAIL,
	COMMENT_REPLY_FAIL,
};

export const LogError = {
	LOG_INSERT_FAIL,
	LOG_REMOVE_FAIL,
};

export const EmployeeError = {
	EMPLOYEE_INSERT_FAIL,
	EMPLOYEE_NOT_EXIST,
	EMPLOYEE_REMOVE_FAIL,
};
