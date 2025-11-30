import mongoose from 'mongoose'
import type { ITransaction } from '@/interfaces'

declare global {
	var mongooseConnection: mongoose.Connection
}

async function createConnection() {
	console.info('get connection...')
	if (!process.env.MONGODB_URI) {
		console.info('MONGODB_URI not defined!')
		return
	}

	global.mongooseConnection ??= mongoose.createConnection(
		process.env.MONGODB_URI
	)
}

export async function seed(value: ITransaction) {
	await createConnection()
	const collection =
		global.mongooseConnection.collection<ITransaction>('transactions')

	await collection.insertOne(value)
	console.info('seeded! ', value)
}

export async function clearCollection() {
	await createConnection()
	const collection =
		global.mongooseConnection.collection<ITransaction>('transactions')

	await collection.deleteMany({})
	console.info('cleared!')
}

export function parseBody<T = object>(body: string): ITransaction & T {
	return JSON.parse(body)
}

export function parseError(body: string): { message: string } {
	return JSON.parse(body)
}
