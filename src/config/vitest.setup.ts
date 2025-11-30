import {
	MongoDBContainer,
	type StartedMongoDBContainer
} from '@testcontainers/mongodb'
import { afterAll, beforeAll } from 'vitest'

let mongoContainer: StartedMongoDBContainer

const startMongoContainer = async () => {
	return new MongoDBContainer('mongo:8.0.10').withReuse().start()
}

beforeAll(async () => {
	mongoContainer = await startMongoContainer()
	process.env.MONGODB_URI = `${mongoContainer.getConnectionString()}/db?directConnection=true`
	console.info('MongoDB Testcontainer started at:', process.env.MONGODB_URI)
})

afterAll(async () => {
	await mongoContainer.stop()
	global.mongooseConnection?.close()
})
