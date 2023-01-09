import CustomError from "./CustomError";

class UnauthorizedError extends CustomError {
	errorCode: 401 | 403;
	errorType = "UNAUTHORIZED";

	constructor(errorCode: 401 | 403, message: string) {
		super(message);
		this.errorCode = errorCode;

		Object.setPrototypeOf(this, UnauthorizedError.prototype);
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

export default UnauthorizedError;
