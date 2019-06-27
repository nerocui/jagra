import React from "react";
import { ScrollablePane, List } from "office-ui-fabric-react";
import EmployeeItem from "./employeeItem.jsx";


const EmployeeItemList = ({ employeesinfo }) => (
		<div>
			<ScrollablePane>
				<List employees={employeesinfo.employees}>
					{employeesinfo.employees.map(employee => (
							<EmployeeItem employee={employee} />
						))}
				</List>
			</ScrollablePane>
		</div>
	);

export default EmployeeItemList;
