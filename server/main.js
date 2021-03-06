import { Meteor } from "meteor/meteor";
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
import emailUrl from "../imports/config/email";

Meteor.startup(() => {
	adminCheck(Employees);
	process.env.MAIL_URL = emailUrl;
});
