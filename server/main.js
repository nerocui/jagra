import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import "../imports/api/comment";
import "../imports/api/employee";
import "../imports/api/file";
import "../imports/api/log";
import "../imports/api/relationship";
import "../imports/api/request";
import "../imports/api/task";
import "../imports/api/team";
import { adminCheck } from "../imports/util/authUtil";
import { Employees } from "../imports/api/db";

// Accounts.onEnrollmentLink((token, done) => {
// 	Accounts.resetPassword(token, "12345678");
// 	done();
// });

Meteor.startup(() => {
	adminCheck(Employees);
	//Temporary location to store this var for now. Need to remove before deploying to produciton
	process.env.MAIL_URL = "smtps://jagrainc%40gmail.com:Jagra123-@smtp.gmail.com:465/";
});
