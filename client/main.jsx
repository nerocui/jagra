import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
// eslint-disable-next-line import/no-unresolved
import App from "/imports/ui/App";

Meteor.startup(() => {
	render(<App />, document.getElementById("react-target"));
});
