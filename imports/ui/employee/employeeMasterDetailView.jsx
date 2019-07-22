import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stack } from "office-ui-fabric-react";
import EmployeeList from "./employeeItemList.jsx";
import { Employees } from "../../api/db";
import * as actions from "../../actions/index";


class EmployeeMasterDetailView extends PureComponent {
	render() {
		let items = this.props.items || [];
		const isChosen = item => (this.props.chosenItem ? item._id === this.props.chosenItem._id : false);
		items = items.map(item => ({ ...item, chosen: isChosen(item) }));
		this.props.setEmployeeDetailItem(Object.assign({}, this.props.chosenItem));
		return (
			<div className="component--employee__master-detail">
				<Stack horizontal>
					<EmployeeList items={items} />
				</Stack>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setEmployeeDetailItem: item => dispatch(actions.setEmployeeDetailItem(item)),
	};
}

const EmployeeMasterDetailViewContainer = withTracker(employeeID => {
	const myEmployeeListHandle = Meteor.subscribe(employeeID);
	const loading = !myEmployeeListHandle.ready();
	const items = Employees.find({}).fetch() || [];
	const chosenItem = Employees.findOne({ _id: employeeID });
	return {
		loading,
		items,
		chosenItem,
	};
})(EmployeeMasterDetailView);

export default connect(null, mapDispatchToProps)(EmployeeMasterDetailViewContainer);
