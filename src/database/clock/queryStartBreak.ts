import { MongoClient } from 'mongodb';

import 'dotenv/config';
import { Clock } from '../../types/Clock';

const uri: string = process.env.MONGO_CONNECT_URL!;
const database: string = process.env.DATABASE!;
const client = new MongoClient(uri);

export const queryStartBreak = async (
	username: string,
	code: string,
	date: any,
	breakStart: any,
) => {
	try {
		return await client
			.db(database)
			.collection<Clock>('Clock')
			.updateOne(
				{ username, code, date },
				{ $push: { breaks: { start: breakStart, end: null } } },
			);
	} catch (error) {
		console.log(error);

		throw error;
	}
};
