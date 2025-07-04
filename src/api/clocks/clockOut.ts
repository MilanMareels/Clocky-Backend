import express from 'express';

import {
	createResponseObject,
	findUser,
	handleErrors,
} from '../../common/common';

import { queryExistingClockIn } from '../../database/clock/queryExistingClockIn';
import { queryClockOut } from '../../database/clock/queryClockOut';
import { NotFoundError } from '../../errors/error';

const router = express.Router();

router.post('/clockout', async (req: any, res) => {
	try {
		const { username, code, project } = req.body;

		await findUser(username, code);

		const date = new Date().toISOString().split('T')[0];

		const exists = await queryExistingClockIn(
			username,
			code,
			project,
			date,
		);
		if (!exists) throw new NotFoundError('Nog geen actieve dag');

		const clockOut = new Date().toISOString();
		await queryClockOut(username, code, project, date, clockOut);

		return createResponseObject(
			200,
			{ message: 'Succesvol uitgeklokt!' },
			res,
		);
	} catch (error) {
		return handleErrors(error, res);
	}
});

export default router;
