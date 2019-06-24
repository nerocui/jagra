import React from "react";
import { Persona } from "office-ui-fabric-react";


class EmployeeItem extends React.PureComponent {
	render() {
		const {
			emailValue,
			firstNameValue,
			lastNameValue,
		} = this.props;

			return (
				<Persona text={`${ firstNameValue } \n ${ lastNameValue }`} secondaryText={emailValue} />
			);
	}
}

export default EmployeeItem;
