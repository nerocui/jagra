import React from "react";
import { ScrollablePane } from "office-ui-fabric-react";
import EmployeeItem from "./employeeItem.jsx";
import style from "../../constant/style";


const EmployeeList = ({
	employees,
	size, //normal/large
}) => (
		<div className="component--employee__employee-list">
			<ScrollablePane className={size}>
					{employees.map(
						employee => (
							<div key={employee._id}>
								<EmployeeItem
  firsName={employee.firstName}
  lastName={employee.lastName}
  email={employee.email}
  size={style.persona.normal}
								/>
							</div>
						),
						)}
			</ScrollablePane>
		</div>
	);

export default EmployeeList;
