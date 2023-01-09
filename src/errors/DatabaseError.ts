import CustomError from "./CustomError";

class DatabaseError extends CustomError {
	errorCode = 500;
	errorType = "DATABASE_ERROR";

	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, DatabaseError.prototype);
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

export default DatabaseError;
