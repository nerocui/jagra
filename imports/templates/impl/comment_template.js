import Template from "../interfaces/template";
import TYPE from "../../constant/actions/type";

class Add extends Template {
	constructor(commentId, commenterId, content) {
		super(TYPE.ADD_COMMENT);
		this.commentId = commentId;
		this.commenterId = commenterId;
		this.content = content;
	}
}

class Remove extends Template {
	constructor(commentId, remover) {
		super(TYPE.REMOVE_COMMENT);
		this.commentId = commentId;
		this.remover = remover;
	}
}

class Edit extends Template {
	constructor(commentId, oldContent, newContent) {
		super(TYPE.EDIT_COMMENT);
		this.commentId = commentId;
		this.oldContent = oldContent;
		this.newContent = newContent;
	}
}

class Reply extends Template {
	constructor(commentId, replyerId, replyeeId, content) {
		super(TYPE.REPLY_COMMENT);
		this.commentId = commentId;
		this.replyerId = replyerId;
		this.replyeeId = replyeeId;
		this.content = content;
	}
}

export default {
	Add,
	Remove,
	Edit,
	Reply,
};
