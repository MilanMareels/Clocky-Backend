import express from 'express';
import { MongoClient } from 'mongodb';
import 'dotenv/config';
import {
	handleErrors,
	createResponseObject,
	findUser,
} from '../../common/common';
import { queryStartBreak } from '../../database/clock/queryStartBreak';

const uri = process.env.MONGO_CONNECT_URL!;
const database = process.env.DATABASE!;
const client = new MongoClient(uri);
const router = express.Router();

router.post('/startBreak', async (req, res) => {
	try {
		const { username, code } = req.body;

		await findUser(username, code);

		const date = new Date().toISOString().split('T')[0];

		const breakStart = new Date().toISOString();

		const result = await queryStartBreak(username, code, date, breakStart);
		if (result.modifiedCount === 0)
			throw new Error('Kan pauze niet starten');

		return createResponseObject(200, { message: 'Pauze gestart' }, res);
	} catch (err) {
		handleErrors(err, res);
	}
});

export default router;
