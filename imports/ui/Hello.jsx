import React, { Component } from "react";
import { PrimaryButton } from "office-ui-fabric-react";

export default class Hello extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 0,
		};
		this.increment = this.increment.bind(this);
	}
	

	increment() {
		this.setState(previousState => ({ counter: previousState.counter + 1 }));
	}

	render() {
		return (
			<div>
				<PrimaryButton type="button" onClick={this.increment}>Click Me</PrimaryButton>
				<p>You've pressed the PrimaryButton {this.state.counter} times.</p>
			</div>
		);
	}
}
