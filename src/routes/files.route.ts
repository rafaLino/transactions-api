import type { Client } from '@libsql/client'
import { GetErrorMessage } from '@/helpers/getErrorMessage'
import { FileRef } from '@/models/fileRef'
import { Bucket } from '@/repository/bucket'
import { SQL } from '@/repository/queries'
import type { FastifyTypedInstance } from '@/types/fastify'
import { HttpStatusCode } from '@/types/httpStatusCode'

export const FilesRoute = {
	config
}

async function config(app: FastifyTypedInstance) {
	app.get(
		'/files',
		{
			schema: {
				tags: ['files']
			}
		},
		async (_, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute(SQL.files.GET_ALL)

			return reply.code(HttpStatusCode.OK).send(result.rows)
		}
	)

	app.get(
		'/files/:ref',
		{
			schema: {
				tags: ['files'],
				params: FileRef
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')

			const result = await turso.execute({
				sql: SQL.files.GET_ONE,
				args: [request.params.ref]
			})

			const statusCode =
				result.rows.length === 1 ? HttpStatusCode.OK : HttpStatusCode.NOTFOUND

			return reply.code(statusCode).send(result.rows.at(0))
		}
	)

	app.get(
		'/files/:ref/download',
		{
			schema: {
				tags: ['files'],
				params: FileRef
			}
		},
		async (request, reply) => {
			const { statusCode, body } = await Bucket.get(request.params.ref)

			return reply.code(statusCode).send(body)
		}
	)

	app.post(
		'/files',
		{
			schema: {
				tags: ['files'],
				consumes: ['multipart/form-data']
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')

			try {
				const { statusCode: bucketStatusCode, ref } = await Bucket.put(request)

				if (bucketStatusCode !== HttpStatusCode.CREATED) {
					return reply
						.code(bucketStatusCode)
						.send({ message: 'File not saved!' })
				}

				const result = await turso.execute({
					sql: SQL.files.INSERT_ONE,
					args: [ref]
				})
				const statusCode =
					result.rowsAffected > 0
						? HttpStatusCode.CREATED
						: HttpStatusCode.BADREQUEST

				return reply.code(statusCode).send()
			} catch (error) {
				const message = GetErrorMessage(error)
				return reply.code(HttpStatusCode.BADREQUEST).send({ message })
			}
		}
	)

	app.delete(
		'/files/:ref',
		{
			schema: {
				tags: ['files'],
				params: FileRef
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')

			const { statusCode: bucketStatusCode } = await Bucket.remove(
				request.params.ref
			)

			if (bucketStatusCode !== HttpStatusCode.NOCONTENT) {
				return reply
					.code(bucketStatusCode)
					.send({ message: 'Something went wrong' })
			}

			const result = await turso.execute({
				sql: SQL.files.DELETE_ONE,
				args: [request.params.ref]
			})

			const statusCode =
				result.rowsAffected > 0
					? HttpStatusCode.NOCONTENT
					: HttpStatusCode.NOTFOUND

			return reply.code(statusCode).send()
		}
	)
}
