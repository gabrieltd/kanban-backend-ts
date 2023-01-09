import CustomError from "./CustomError";

class DuplicationError extends CustomError {
	errorCode = 409;
	errorType = "DUPLICATED_RECORD";

	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, DuplicationError.prototype);
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

export default DuplicationError;
