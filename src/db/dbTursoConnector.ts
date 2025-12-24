import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { createClient } from '@libsql/client'

export default fastifyPlugin(async function dbConnector(
	fastify: FastifyInstance,
	options: {
		url: string | undefined
		token: string | undefined
	}
) {
	try {
		if (!options.url || !options.token) {
			fastify.log.error(`TursoDB connection error`)
			throw new Error(`TursoDB connection error`)
		}

		const db = createClient({
			url: options.url,
			authToken: options.token
		})

		fastify.log.info('TursoDB connected')
		fastify.decorate('turso', db)

		fastify.addHook('onClose', () => db.close())
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err)
		fastify.log.error(`TursoDB connection error: ${errorMessage}`)

		throw err
	}
})
