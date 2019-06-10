import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
// eslint-disable-next-line import/no-unresolved
import routes from "/imports/ui/App";

Meteor.startup(() => {
	render(routes, document.getElementById("react-target"));
});
