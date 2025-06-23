import express from 'express';
import { queryExistingClockIn } from '../../database/clock/queryExistingClockin';
import {
	handleErrors,
	createResponseObject,
	findUser,
} from '../../common/common';
import { Clock } from '../../types/Clock';
import { ConflictError } from '../../errors/error';

const router = express.Router();

router.post('/status', async (req, res) => {
	try {
		const { username, code } = req.body;

		await findUser(username, code);

		const date = new Date().toISOString().split('T')[0];

		const clock: Clock = (await queryExistingClockIn(
			username,
			code,
			date,
		)) as Clock;
		if (!clock) throw new ConflictError('Niet ingeklokt');

		const isOut = clock.clockOut !== null;
		const isOnBreak = clock.breaks.some((b: any) => b.end === null);

		return createResponseObject(
			200,
			{
				status: isOut
					? 'Uitgeklokt'
					: isOnBreak
						? 'Op pauze'
						: 'Ingeklokt',
				clock,
			},
			res,
		);
	} catch (err) {
		handleErrors(err, res);
	}
});

export default router;
