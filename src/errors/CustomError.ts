abstract class CustomError extends Error {
	abstract errorCode: number;
	abstract errorType: string;

	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract serializeErrors(): {
		code: number;
		type: string;
		message: string;
		path?: string;
	}[];
}

export default CustomError;
