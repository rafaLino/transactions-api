import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { HttpStatusCode } from '@/types/httpStatusCode'

const API_KEY = process.env.API_KEY

export function authentication(fastify: FastifyInstance) {
	if (!API_KEY) {
		fastify.log.error('APIKEY not provided!')
	}
	fastify.decorate('authenticate', handler)
}

async function handler(request: FastifyRequest, reply: FastifyReply) {
	const apiKey = request.headers['x-api-key']
	if (!apiKey || apiKey !== API_KEY) {
		return reply
			.code(HttpStatusCode.UNAUTHORIZED)
			.send({ message: 'Unauthorized' })
	}
}
