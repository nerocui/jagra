import React from "react";

const EmployeeList = ({ employees }) => {
	return (
		<div>
			<h2>Employee List</h2>
			{employees.map(employee => (
				<div key={employee._id}>
					{employee.firstName}
				</div>
			))}
		</div>
	);
};

export default EmployeeList;
