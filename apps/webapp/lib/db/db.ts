import { MongoClient, ServerApiVersion } from 'mongodb';

const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
};

class MongoDBClient {
	private static instance: MongoClient;

	private constructor() {}

	public static async getInstance(): Promise<MongoClient> {
		const uri = process.env.MONGODB_URI;
		if (!uri) {
			throw new Error('MONGODB_URI is not defined');
		}
		if (!MongoDBClient.instance) {
			if (process.env.NODE_ENV === 'development') {
				// In development mode, use a global variable so that the value
				// is preserved across module reloads caused by HMR (Hot Module Replacement).
				let globalWithMongo = global as typeof globalThis & {
					_mongoClient?: MongoClient;
				};

				if (!globalWithMongo._mongoClient) {
					globalWithMongo._mongoClient = new MongoClient(uri, options);
					// Ensure connection is established
					await globalWithMongo._mongoClient.connect();
				}
				MongoDBClient.instance = globalWithMongo._mongoClient;
			} else {
				// In production mode, create a new client instance
				MongoDBClient.instance = new MongoClient(uri, options);
				// Ensure connection is established
				await MongoDBClient.instance.connect();
			}
		}

		return MongoDBClient.instance;
	}
}

export default MongoDBClient;
