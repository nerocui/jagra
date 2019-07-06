import React from "react";
import { Persona } from "office-ui-fabric-react";

const EmployeeItem = ({
	firsName,
	lastName,
	email,
	size, //normal/large
}) => (
	<div>
		<Persona
		className={size}
		text={`${ firsName } \n ${ lastName }`}
		secondaryText={email}
		/>
	</div>
);

export default EmployeeItem;
