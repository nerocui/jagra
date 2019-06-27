import React from "react";
import { Persona } from "office-ui-fabric-react";

const EmployeeItem = employee => (
	<div>
		<Persona text={`${ employee.firstNameValue } \n ${ employee.lastNameValue }`} secondaryText={employee.emailValue} />
	</div>
);

export default EmployeeItem;
