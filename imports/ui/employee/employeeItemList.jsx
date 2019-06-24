import React from "react";
import { ScrollablePane, List } from "office-ui-fabric-react";


const EmployeeItemList = props => {
	return (
		<ScrollablePane>
		<List items={props.EmployItems}>
		{EmployItems.map(EmployItem => <EmployeeItem item={EmployItem} />)}
		</List>
		</ScrollablePane>
	);
};

export default EmployeeItemList;
