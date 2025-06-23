import express from 'express';

import {
	createResponseObject,
	findUser,
	handleErrors,
} from '../../common/common';
import { ConflictError } from '../../errors/error';
import { queryAddClockIn } from '../../database/clock/queryClockIn';
import { queryExistingClockIn } from '../../database/clock/queryExistingClockIn';

const router = express.Router();

router.post('/clockin', async (req: any, res) => {
	try {
		const { username, code } = req.body;

		await findUser(username, code);

		const date = new Date().toISOString().split('T')[0];

		const exists = await queryExistingClockIn(username, code, date);
		if (exists) throw new ConflictError('Je bent al ingeklokt vandaag');

		const clockIn = new Date().toISOString();
		await queryAddClockIn(username, code, date, clockIn);

		return createResponseObject(
			200,
			{ message: 'Succesvol ingeklokt!' },
			res,
		);
	} catch (error) {
		return handleErrors(error, res);
	}
});

export default router;
