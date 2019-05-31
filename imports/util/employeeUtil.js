// eslint-disable-next-line import/prefer-default-export
export const isAdmin = (id, db) => {
	const admin = db.findOne({ id });
	const adminrole = admin.role;
	return !!(adminrole && adminrole === "admin");
};
