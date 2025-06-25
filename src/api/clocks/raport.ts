import express from 'express';
import 'dotenv/config';
import { handleErrors, createResponseObject } from '../../common/common';
import { queryRaport } from '../../database/clock/queryRaport';

const router = express.Router();

router.get('/clock/:username/:code', async (req, res) => {
	try {
		const { username, code } = req.params;

		const records = await queryRaport(username, code);

		return createResponseObject(200, records, res);
	} catch (error) {
		handleErrors(error, res);
	}
});

export default router;
