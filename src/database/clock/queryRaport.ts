import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri: string = process.env.MONGO_CONNECT_URL!;
const database: string = process.env.DATABASE!;
const client = new MongoClient(uri);

// Bereken gewerkte tijd (uren en minuten), rekening houdend met pauzes
function calculateWorkedTime(
	clockIn: string,
	clockOut: string | null,
	breaks: { start: string; end: string | null }[],
) {
	if (!clockOut) return { hours: 0, minutes: 0 };

	const start = new Date(clockIn).getTime();
	const end = new Date(clockOut).getTime();

	let totalBreakMs = 0;

	for (const br of breaks) {
		if (br.start && br.end) {
			const brStart = new Date(br.start).getTime();
			const brEnd = new Date(br.end).getTime();
			totalBreakMs += brEnd - brStart;
		}
	}

	const workedMs = end - start - totalBreakMs;
	if (workedMs < 0) return { hours: 0, minutes: 0 }; // Voor veiligheid

	const totalMinutes = Math.floor(workedMs / (1000 * 60));
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	return { hours, minutes };
}

export const queryRaport = async (
	username: string,
	code: string,
	project: string,
) => {
	try {
		await client.connect(); // Zorg dat client verbonden is

		const records = await client
			.db(database)
			.collection('Clock')
			.find({ username, code, project })
			.sort({ date: -1 })
			.toArray();

		let totalMinutes = 0;

		const enhancedRecords = records.map((record) => {
			const { hours, minutes } = calculateWorkedTime(
				record.clockIn,
				record.clockOut,
				record.breaks || [],
			);

			const workedMinutes = hours * 60 + minutes;
			totalMinutes += workedMinutes;

			return {
				date: record.date,
				clockIn: record.clockIn,
				clockOut: record.clockOut,
				breaks: record.breaks,
				workedHours: `${hours}u ${minutes}m`,
			};
		});

		const totalHours = Math.floor(totalMinutes / 60);
		const totalRemainMinutes = totalMinutes % 60;

		return {
			days: enhancedRecords,
			totalWorked: `${totalHours}u ${totalRemainMinutes}m`,
		};
	} catch (error) {
		throw error;
	}
};
