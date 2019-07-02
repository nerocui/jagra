import React from "react";
import { ScrollablePane, List } from "office-ui-fabric-react";
import EmployeeItem from "./employeeItem.jsx";


const EmployeeItemList = ({ employeesinfo }) => (
		<div>
			<ScrollablePane>
				<List items={employeesinfo.items}>
					{employeesinfo.items.map(
						item => (
							<EmployeeItem
  firsName={item.firstName}
  lastName={item.lastName}
  email={item.email}
							/>
						),
						)}
				</List>
			</ScrollablePane>
		</div>
	);

export default EmployeeItemList;
