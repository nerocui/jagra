import React, { Component } from "react";

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
				<button type="button" onClick={this.increment}>Click Me</button>
				<p>You've pressed the button {this.state.counter} times.</p>
			</div>
		);
	}
}
