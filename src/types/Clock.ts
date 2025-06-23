interface Break {
	start: string;
	end: string | null;
}

export interface Clock {
	userId: string;
	date: string;
	clockIn: string;
	clockOut: string | null;
	breaks: Break[];
}
