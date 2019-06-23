import React from "react";
import { Persona } from "office-ui-fabric-react";

const EmployeeItem = ({
	emailValue,
	firstNameValue,
	lastNameValue,
}) => (
	<Persona text={`${ firstNameValue } \n ${ lastNameValue }`} secondaryText={emailValue} />
);

export default EmployeeItem;
