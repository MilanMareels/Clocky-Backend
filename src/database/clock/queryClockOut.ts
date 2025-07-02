import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri: string = process.env.MONGO_CONNECT_URL!;
const database: string = process.env.DATABASE!;
const client = new MongoClient(uri);

export const queryClockOut = async (
	username: string,
	code: string,
	project: string,
	date: string,
	clockOut: string,
) => {
	try {
		const result = await client
			.db(database)
			.collection('Clock')
			.updateOne(
				{ username, code, project, date, clockOut: null },
				{ $set: { clockOut } },
			);

		if (result.modifiedCount === 0) {
			throw new Error('Al uitgeklokt of geen klok-in gevonden');
		}
	} catch (error) {
		throw error;
	}
};
