export default class Template {
	constructor(value) {
		this.type = value;
	}

	toLog() {
		return this.type;
	}

	toEmail() {
		return `<div> ${ this.type } </div>`;
	}
}
