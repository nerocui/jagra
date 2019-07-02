import React from "react";
import { ScrollablePane } from "office-ui-fabric-react";
import EmployeeItem from "./employeeItem.jsx";


const EmployeeList = ({ employees }) => (
		<div>
			<ScrollablePane>
					{employees.map(
						employee => (
							<div key={employee._id}>
								<EmployeeItem
  firsName={employee.firstName}
  lastName={employee.lastName}
  email={employee.email}
								/>
							</div>
						),
						)}
			</ScrollablePane>
		</div>
	);

export default EmployeeList;
