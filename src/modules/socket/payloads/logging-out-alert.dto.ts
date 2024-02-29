export class loggingOutAlert {
	email: string;
	oldTokens: [
		{
			id: number;
			createdAt: Date;
			email: string;
			isExpired: boolean;
			token: string;
		},
	];
	user_id: number;
}