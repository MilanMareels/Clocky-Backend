import express from 'express';

import clockIn from './clocks/clockIn';
import clockOut from './clocks/clockOut';
import raport from './clocks/raport';
import status from './clocks/status';
import startBreak from './clocks/startBreak';
import endBreak from './clocks/endBreak';

import { closeDatabase, connectDatabase } from '../database/db';

const router = express.Router();

// Achter deze API endpoint zitten al de endpoints. {baseUrl}/api/v1/{api-endpoint}
router.get('/', async (req, res) => {
	try {
		await connectDatabase();
		return res.json({
			message: 'API V1',
		});
	} catch (error) {
		return error;
	} finally {
		await closeDatabase();
	}
});

// Hier worden de beveiligde endpoints gedefinieerd die gebruikt moeten worden door de router.

// Clock
router.use(clockIn);
router.use(clockOut);
router.use(raport);
router.use(status);
router.use(startBreak);
router.use(endBreak);

export default router;
