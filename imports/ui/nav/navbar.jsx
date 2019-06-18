import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CommandBar, initializeIcons } from "office-ui-fabric-react";

initializeIcons();

const navItems = [
	{
		key: "tasksTab",
		name: "Tasks",
		cacheKey: "tasksTabCacheKey", // changing this key will invalidate this items cache
		iconProps: {
			iconName: "TaskManager",
		},
		ariaLabel: "Tasks",
		subMenuProps: {
			items: [
				{
					key: "tasksAssignedToMe",
					name: "Assigned To Me",
					iconProps: {
						iconName: "Assign",
					},
					"data-automation-id": "newEmailButton",
				},
				{
					key: "tasksCreatedByMe",
					name: "Created By Me",
					iconProps: {
						iconName: "AddFriend",
					},
				},
				{
					key: "tasksIAmWatching",
					name: "Watch List",
					iconProps: {
						iconName: "Glasses",
					},
				},
				{
					key: "teamTasks",
					name: "Team Tasks",
					iconProps: {
						iconName: "Teamwork",
					},
				},
				{
					key: "allTasks",
					name: "All Tasks",
					iconProps: {
						iconName: "AllApps",
					},
				},
			],
		},
	},
	{
		key: "commentsTab",
		name: "Comments",
		iconProps: {
			iconName: "Comment",
		},
		"data-automation-id": "uploadButton",
		subMenuProps: {
			items: [
				{
					key: "myComments",
					name: "My Comments",
					iconProps: {
						iconName: "Mail",
					},
					"data-automation-id": "newEmailButton",
				},
				{
					key: "repliesComment",
					name: "Replies Comments",
					iconProps: {
						iconName: "MailReply",
					},
				},
				{
					key: "teamComments",
					name: "Team Comments",
					iconProps: {
						iconName: "ConnectContacts",
					},
				},
			],
		},
	},
	{
		key: "filesTab",
		name: "Files",
		iconProps: {
			iconName: "Documentation",
		},
		subMenuProps: {
			items: [
				{
					key: "myFiles",
					name: "My Files",
					iconProps: {
						iconName: "UserFollowed",
					},
					"data-automation-id": "newEmailButton",
				},
				{
					key: "teamFiles",
					name: "Team Files",
					iconProps: {
						iconName: "People",
					},
				},
			],
		},
	},
	{
		key: "employeesTab",
		name: "Employees",
		iconProps: {
			iconName: "People",
		},
		subMenuProps: {
			items: [
				{
					key: "teamMember",
					name: "Team Member",
					iconProps: {
						iconName: "Teamwork",
					},
					"data-automation-id": "newEmailButton",
				},
				{
					key: "managers",
					name: "Managers",
					iconProps: {
						iconName: "WorkforceManagement",
					},
				},
				{
					key: "subordinates",
					name: "Subordinates",
					iconProps: {
						iconName: "People",
					},
				},
			],
		},
	},
  ];

class Navbar extends Component {
	render() {
		return (
			<div>
				<h1>Navbar</h1>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/admin">Admin Dashboard</Link>
					</li>
					<li>
						<Link to="/dashboard">Employee Dashboard</Link>
					</li>
				</ul>
				<CommandBar
  items={navItems}

				/>
			</div>
		);
	}
}

export default Navbar;
