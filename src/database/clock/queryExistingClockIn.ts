import { MongoClient } from 'mongodb';

import 'dotenv/config';
import { Clock } from '../../types/Clock';

const uri: string = process.env.MONGO_CONNECT_URL!;
const database: string = process.env.DATABASE!;
const client = new MongoClient(uri);

export const queryExistingClockIn = async (
	username: string,
	code: string,
	date: string,
): Promise<Clock | unknown> => {
	try {
		const clock = await client
			.db(database)
			.collection('Clock')
			.findOne({ username, code, date });
		return clock;
	} catch (error) {
		throw error;
	}
};
