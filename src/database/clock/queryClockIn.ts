import { MongoClient } from 'mongodb';

import 'dotenv/config';

const uri: string = process.env.MONGO_CONNECT_URL!;
const database: string = process.env.DATABASE!;
const client = new MongoClient(uri);

export const queryAddClockIn = async (
	username: string,
	code: string,
	project: string,
	date: string,
	clockIn: string,
) => {
	try {
		await client.db(database).collection('Clock').insertOne({
			username,
			code,
			project,
			date,
			clockIn,
			clockOut: null,
			breaks: [],
		});
	} catch (error) {
		throw error;
	}
};
