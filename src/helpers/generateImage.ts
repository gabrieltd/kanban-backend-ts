export const generateImage = (username: string): string => {
	if (username.includes("-")) {
		const firstLetter = username.split("-")[0][0];
		const secondLetter = username.split("-")[1][0];
		return `https://api.dicebear.com/5.x/initials/svg?seed=${firstLetter}${secondLetter}-${username}`;
	}

	return `https://api.dicebear.com/5.x/initials/svg?seed=${username}`;
};
