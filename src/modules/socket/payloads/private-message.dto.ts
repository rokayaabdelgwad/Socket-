export class PrivateMessagePayload {
	date: string;
	image: Express.Multer.File;;
	reciver_id: number;
	reciver_name: string;
	sender_id: number;
	sender_name: string;
	message: string;
}