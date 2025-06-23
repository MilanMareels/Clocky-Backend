import { MongoClient } from 'mongodb';

import 'dotenv/config';

const uri: string = process.env.MONGO_CONNECT_URL!;
const database: string = process.env.DATABASE!;
const client = new MongoClient(uri);

export const queryEndBreak = async (
	username: string,
	code: string,
	date: any,
	breakEnd: any,
) => {
	try {
		return await client
			.db(database)
			.collection('Clock')
			.updateOne(
				{
					username,
					code,
					date,
					breaks: { $elemMatch: { end: null } },
				},
				{ $set: { 'breaks.$.end': breakEnd } },
			);
	} catch (error) {
		console.log(error);

		throw error;
	}
};
