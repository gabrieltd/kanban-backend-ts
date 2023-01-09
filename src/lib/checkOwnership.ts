export const checkOwnership = (userId: string, resourceId: string): boolean => {
	return userId === resourceId;
};
