const commentsTab = {
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
};

export default commentsTab;
