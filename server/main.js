import { Meteor } from "meteor/meteor";
import Links from "/imports/api/links";
import Mailer from "../imports/api/email";

function insertLink(title, url) {
	Links.insert({ title, url, createdAt: new Date() });
}

const sendEmail = async () => {
	try {
		const mailer = new Mailer({ subject: "test from jagra", recipients: [{ email: "nerocui@outlook.com" }] }, "hello");
		await mailer.send().then(res => {
			console.log(res);
		});
	} catch (e) {
		console.log(e);
	}
};

Meteor.startup(() => {
	// If the Links collection is empty, add some data.
	sendEmail();
	if (Links.find().count() === 0) {
		insertLink(
			"Do the Tutorial",
			"https://www.meteor.com/tutorials/react/creating-an-app",
		);

		insertLink(
			"Follow the Guide",
			"http://guide.meteor.com",
		);

		insertLink(
			"Read the Docs",
			"https://docs.meteor.com",
		);

		insertLink(
			"Discussions",
			"https://forums.meteor.com",
		);
	}
});
