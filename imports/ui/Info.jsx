import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Links from "../api/links";

class Info extends Component {
	makeLink(link) {
		return (
			<li key={link._id}>
				<a href={link.url}>{link.title}</a>
			</li>
		);
	}
  
	render() {
		let { links } = this.props;
		links = links.map(
			link => this.makeLink(link),
		);

		return (
			<div>
				<h2>Learn Meteor!</h2>
				<ul>{ links }</ul>
			</div>
		);
	}
}

// eslint-disable-next-line no-undef
export default InfoContainer = withTracker(() => ({
	links: Links.find().fetch(),
}))(Info);
