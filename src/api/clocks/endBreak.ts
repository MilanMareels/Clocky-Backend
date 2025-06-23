import express from 'express';
import 'dotenv/config';
import {
	handleErrors,
	createResponseObject,
	findUser,
} from '../../common/common';
import { ConflictError } from '../../errors/error';
import { queryEndBreak } from '../../database/clock/queryEndBreak';

const router = express.Router();

router.post('/endBreak', async (req, res) => {
	try {
		const { username, code } = req.body;

		await findUser(username, code);

		const date = new Date().toISOString().split('T')[0];

		const breakEnd = new Date().toISOString();

		const result = await queryEndBreak(username, code, date, breakEnd);
		if (result.modifiedCount === 0)
			throw new ConflictError('Geen actieve pauze gevonden');

		return createResponseObject(200, { message: 'Pauze beëindigd' }, res);
	} catch (err) {
		handleErrors(err, res);
	}
});

export default router;
