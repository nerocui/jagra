import React, { Component } from "react";
import Hello from "./Hello.jsx";
import Info from "./Info.jsx";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: 'Jagra',
		};
	}

	render() {
		const { title } = this.state;
		return (
			<div>
				<h1>Welcome to {title}!</h1>
				<Hello />
				<Info />
			</div>
		);
	}
}

export default App;
