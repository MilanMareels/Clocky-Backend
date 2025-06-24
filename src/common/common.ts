import { queryUser } from '../database/user/queryUser';
import { errorTypes, NotFoundError } from '../errors/error';
import { User } from '../types/User';

export const createResponseObject = (
	statusCode: number,
	body: any, // eslint-disable-line @typescript-eslint/no-explicit-any
	res: any, // eslint-disable-line @typescript-eslint/no-explicit-any
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
	return res.status(statusCode).json(body);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const handleErrors = (
	error: any, // eslint-disable-line @typescript-eslint/no-explicit-any
	res: any, // eslint-disable-line @typescript-eslint/no-explicit-any
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
	const { message, statusCode } = checkErrorType(error);
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	return createResponseObject(statusCode!, { message: message }, res);
};

const checkErrorType = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error: any,
): {
	message: string | undefined;
	statusCode: number | undefined;
} => {
	let message, statusCode;
	for (const errorType of errorTypes) {
		if (error instanceof errorType) {
			message = error.message;
			statusCode = error.statusCode;
			break;
		}
	}
	return { message, statusCode };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNullOrUndefined = (obj: any): boolean => {
	return obj === null || obj === undefined;
};

export const findUser = async (
	username: string,
	code: string,
): Promise<User> => {
	const user: User = (await queryUser(username, code)) as User;
	if (!user)
		throw new NotFoundError(
			'Gebruiker niet gevonden of onjuiste inloggegevens. Controleer je gebruikersnaam en wachtwoord en probeer het opnieuw.',
		);
	return user;
};
