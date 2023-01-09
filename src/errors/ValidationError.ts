import CustomError from "./CustomError";

class ValidationError extends CustomError {
	errorCode = 422;
	errorType = "VALIDATION_ERROR";

	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, ValidationError.prototype);
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

export default ValidationError;
