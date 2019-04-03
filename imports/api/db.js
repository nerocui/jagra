import { Mongo } from "meteor/mongo";

export const Tasks = new Mongo.Collection("tasks"),
	Employees = new Mongo.Collection("employees"),
	Comments = new Mongo.Collection("comments"),
	Files = new Mongo.Collection("files"),
	Relationships = new Mongo.Collection("relationships"),
	Requests = new Mongo.Collection("requests"),
	Logs = new Mongo.Collection("logs"),
	Teams = new Mongo.Collection("teams");
