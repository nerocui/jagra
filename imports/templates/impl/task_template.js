import Template from "../interfaces/template";
import TYPE from "../../constant/actions/type";

class Create extends Template {
	constructor(taskId, creatorId) {
		super(TYPE.CREATE_TASK);
		this.taskId = taskId;
		this.creatorId = creatorId;
	}
	//TODO: in the future, more function will be added to each class and/or the interface
	//like color of each field, template text etc.
}

class Delete extends Template {
	constructor(taskId) {
		super(TYPE.DELETE_TASK);
		this.taskId = taskId;
	}
}

class ModifyDescription extends Template {
	constructor(taskId, modifierId, oldDes, newDes) {
		super(TYPE.MODIFY_TASK_DES);
		this.taskId = taskId;
		this.modifierId = modifierId;
		this.oldDes = oldDes;
		this.newDes = newDes;
	}
}

class ModifyStatus extends Template {
	constructor(taskId, modifierId, oldStatus, newStatus) {
		super(TYPE.MODIFY_TASK_STATUS);
		this.taskId = taskId;
		this.modifierId = modifierId;
		this.oldStatus = oldStatus;
		this.newStatus = newStatus;
	}
}

class ModifyDue extends Template {
	constructor(taskId, modifierId, oldDue, newDue) {
		super(TYPE.MODIFY_TASK_DUE);
		this.taskId = taskId;
		this.modifierId = modifierId;
		this.oldDue = oldDue;
		this.newDue = newDue;
	}
}

class Assign extends Template {
	constructor(taskId, oldAssigneeId, newAssigneeId, assignerId) {
		super(TYPE.ASSIGN_TASK);
		this.taskId = taskId;
		this.oldAssigneeId = oldAssigneeId;
		this.newAssigneeId = newAssigneeId;
		this.assignerId = assignerId;
	}
}

//TODO: add more class for each type of action, and add more files for more action types

export default {
	Create,
	Delete,
	ModifyDescription,
	ModifyStatus,
	ModifyDue,
	Assign,
};
