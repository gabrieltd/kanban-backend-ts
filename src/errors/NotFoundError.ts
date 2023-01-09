import CustomError from "./CustomError";

class NotFoundError extends CustomError {
	errorCode = 404;
	errorType = "NOT_FOUND";

	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, NotFoundError.prototype);
	}

	serializeErrors() {
		return [
			{
				code: this.errorCode,
				type: this.errorType,
				message: this.message,
			},
		];
	}
}

export default NotFoundError;
