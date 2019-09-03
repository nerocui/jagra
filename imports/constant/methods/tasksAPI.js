export default {
	INSERT: "tasks.insert",
	REMOVE: "tasks.remove",
	UPDATE_TITLE: "tasks.updateTitle",
	UPDATE_DESCRIPTION: "tasks.updateDescription",
	UPDATE_STATUS: "tasks.updateStatus",
	ASSIGN_TO: "tasks.assignTo",
	CHANGE_DUE_DATE: "tasks.changeDueDate",
	ADD_COMMENT: "tasks.addComment",
	REMOVE_COMMENT: "tasks.removeComment",
	WATCH: "tasks.watch",
	ADD_WATCHER: "tasks.addWatcher",
	ADD_WATCHERS: "tasks.addWatchers",
	ADD_WATCHERS_BY_TEAM: "tasks.addWatchersByTeam",
	UNWATCH: "tasks.unwatch",
	REMOVE_WATCHER: "tasks.removeWatcher",
	REMOVE_WATCHERS: "tasks.removeWatchers",
	REMOVE_WATCHERS_BY_TEAM: "tasks.removeWatchersByTeam",
	//TODO({HbsiJJCY5}): implement api for files and relationships
};
/**
 * tasks.insert()
 * requires: task title
 * optional: task description
 * behavior: user click the create button, a small inline form expand and ask for the title and description
 * 			 upon creation, title is the only thing required. Then the user can go in and make changes
 *
 * tasks.remove()
 * requires: id
 * behavior: delete a task entry iff the user is the creator
 * 			 if deleted, then handle the references to this task in other db
 * 			 	-for each relationship, relationships.remove_task(relationship_id, task_id)
 * 					each relationship has two tasks, if one of them is "removed", then save an invalid field and display it crossed out or grey and not clickable
 * 					if both task are "removed", then delete the relationship
 * 				...
 * 				-never delete file when a task is being deleted even the reference count to the file goes to zero
 * 				for the sake of file recovery, files can only be deleted by admin
 *
 * tasks.assignTo()
 * requires: id
 * behavior: -assign it to someone iff the user is the creator or the current assignee
 * 			 task should be allowed to be assigned to anyone
 * 			 -if assigned, update the task reference in OG assignee, new assignee
 *
 * tasks.changeDueDate()
 * requires: id
 * behavior: only creator can change due date
 *
 * tasks.addComment()
 * requires: id, commentId
 * behavior: -This api is called from comments.insert(task_id) instead directly from front end
 * 			 -After successfully inserting a new comment to db, call this api with the task_id and commment_id
 * 			 -Anyone can leave a comment on any task
 *
 * tasks.removeComment()
 * requires: id, commentId
 * behavior: -Only comment creator can delete a comment
 * 			 -If deleted ref from task, delete the real comment in db by calling comments.remove
 *
 */
