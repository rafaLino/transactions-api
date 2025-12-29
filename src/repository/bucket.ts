import type { FastifyRequest } from 'fastify'
import { request as uRequest } from 'undici'

async function put(
	req: FastifyRequest
): Promise<{ statusCode: number; ref: string }> {
	let ref = ''
	let statusCode = 500
	const parts = req.parts()

	for await (const part of parts) {
		if (part.type === 'field' && part.fieldname === 'ref') {
			ref = part.value as string
		}

		if (!ref) {
			throw new Error('Ref not found!')
		}

		if (part.type === 'file' && part.fieldname === 'csv') {
			const { statusCode: workerStatus, body } = await uRequest(
				`${process.env.WORKER_URL}/${ref}`,
				{
					method: 'PUT',
					headers: {
						'content-type': part.mimetype,
						'x-api-key': process.env.API_KEY
					},
					body: part.file
				}
			)

			statusCode = workerStatus
			await body.dump()
		}
	}

	return { statusCode, ref }
}

async function get(ref: string) {
	const { statusCode, body } = await uRequest(
		`${process.env.WORKER_URL}/${ref}`,
		{
			method: 'GET',
			headers: {
				'x-api-key': process.env.API_KEY
			}
		}
	)

	return { statusCode, body: await body.text() }
}

async function remove(ref: string) {
	const { statusCode, body } = await uRequest(
		`${process.env.WORKER_URL}/${ref}`,
		{
			method: 'DELETE',
			headers: {
				'x-api-key': process.env.API_KEY
			}
		}
	)

	await body.dump()
	return { statusCode }
}

export const Bucket = {
	put,
	get,
	remove
}
