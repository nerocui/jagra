/* eslint-disable meteor/no-session */
import React from "react";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { createBrowserHistory } from "history";
import { Tracker } from "meteor/tracker";
import { Session } from "meteor/session";
import routes from "../imports/ui/routes/index.jsx";

const history = createBrowserHistory();

Meteor.startup(() => {
	render(routes, document.getElementById("react-target"));
});

Accounts.onEnrollmentLink((token, done) => {
	history.push(`/reset?token=${ token }`);
	Tracker.autorun(() => {
		if (Session.get("enroll")) {
			done();
			Session.set("enroll", false);
			history.push("/dashboard");
		}
	});
});
