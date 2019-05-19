/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
import { Meteor } from "meteor/meteor";
import chai from "chai";
// import StubCollections from "meteor/hwillson:stub-collections";
// import { resetDatabase } from "meteor/xolvio:cleaner";
import { Logs } from "./db";
import { insertLog, removeLog } from "./log";

if (Meteor.isServer) {
	const { expect } = chai;
	describe("Log API Tests", function () {
		const log1 = {
			name: "logid1",
			type: "test",
			value: "this is a test value for log",
		};
		
		Logs.remove({});
		const _id = insertLog(Logs, log1);

		it("Should insert a log to the db", function () {
			const log = Logs.findOne({ _id });
			expect(log).to.not.be.undefined;
			expect(Logs.find().fetch()).to.have.lengthOf(1);
		});

		it("Should remove a log from the db", function () {
			removeLog(Logs, _id);
			const log = Logs.findOne({ _id });
			expect(log).to.be.undefined;
			expect(Logs.find().fetch()).to.have.lengthOf(0);
		});
	});
}
