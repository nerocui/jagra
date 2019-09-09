/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
import { Meteor } from "meteor/meteor";
import chai from "chai";
import { Employees } from "./db";
import "./comment";
import "./employee";
import "./task";
import EMPLOYEEAPI from "../constant/methods/employeesAPI";


const { expect } = chai;

describe("Employee API Tests", function () {
	Employees.remove({});
	const _id = Meteor.call(EMPLOYEEAPI.INSERT, "firstname", "lastname");
	console.log("[EMPLOYEE TEST] ID is: ", _id);
	it("Should insert a comment to the db", function () {
		const employee = Employees.findOne({ _id });
		expect(employee).to.not.be.undefined;
		expect(Employees.find().fetch()).to.have.lengthOf(1);
	});

	it("Should remove an employee from the db", function () {
		expect(
			Meteor.call(EMPLOYEEAPI.REMOVE, _id),
		).to.not.throw;
		const employee = Employees.findOne({ _id });
		console.log(employee);
		expect(employee).to.be.undefined;
		expect(Employees.find().fetch()).to.have.lengthOf(0);
		console.log("[Employees TEST] Finished removal test.");
	});
});
