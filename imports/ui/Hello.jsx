import React, { Component } from "react";

export default class Hello extends Component {
	state = {
		counter: 0,
	}

	increment() {
		const { counter } = this.state + 1;
		this.setState({
			counter,
		});
	}

	render() {
		const { counter } = this.state;
		return (
			<div>
				<button type="button" onClick={this.increment}>Click Me</button>
				<p>You've pressed the button {counter} times.</p>
			</div>
		);
	}
}
