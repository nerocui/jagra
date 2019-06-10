import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
	<div>
		<h1>Navbar</h1>
		<ul>
			<li>
				<Link to="/">Home</Link>
			</li>
			<li>
				<Link to="/admin">Admin Dashboard</Link>
			</li>
			<li>
				<Link to="/dashboard">Employee Dashboard</Link>
			</li>
		</ul>
		
	</div>
);

export default Navbar;
