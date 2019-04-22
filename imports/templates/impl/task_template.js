import Template from "../interfaces/template";
import TYPE from "../../constant/actions/type";

class CreateTask extends Template {
	constructor(taskId, creatorId) {
		super(TYPE.CREATE_TASK);
		this.taskId = taskId;
		this.creatorId = creatorId;
	}
	//TODO: in the future, more function will be added to each class and/or the interface
	//like color of each field, template text etc.
}

class DeleteTask extends Template {
	constructor(taskId) {
		super(TYPE.DELETE_TASK);
		this.taskId = taskId;
	}
}

//TODO: add more class for each type of action, and add more files for more action types

export default {
	CreateTask,
	DeleteTask,
};
