import express from 'express';
import 'dotenv/config';
import { handleErrors, createResponseObject } from '../../common/common';
import { queryRaport } from '../../database/clock/queryRaport';

const router = express.Router();

router.get('/clock/:username/:code/:project', async (req, res) => {
	try {
		const { username, code, project } = req.params;

		const records = await queryRaport(username, code, project);

		return createResponseObject(200, records, res);
	} catch (error) {
		handleErrors(error, res);
	}
});

export default router;
