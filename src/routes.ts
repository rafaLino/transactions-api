import { GetErrorMessage } from './helpers/getErrorMessage'
import { FileRef } from './models/fileRef'
import { SQL } from './repository/queries'
import type { FastifyTypedInstance } from './types/fastify'
import { HttpStatusCode } from './types/httpStatusCode'
import { Client, LibsqlError } from '@libsql/client'

export async function routes(app: FastifyTypedInstance) {
	app.get(
		'/files',
		{
			schema: {
				tags: ['files']
			}
		},
		async (_, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute(SQL.GET_ALL)

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
				sql: SQL.GET_ONE,
				args: [request.params.ref]
			})

			const statusCode =
				result.rows.length === 1 ? HttpStatusCode.OK : HttpStatusCode.NOTFOUND

			return reply.code(statusCode).send(result.rows.at(0))
		}
	)

	app.post(
		'/files',
		{
			schema: {
				tags: ['files'],
				body: FileRef
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')
			try {
				const result = await turso.execute({
					sql: SQL.INSERT_ONE,
					args: [request.body.ref]
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

			const result = await turso.execute({
				sql: SQL.DELETE_ONE,
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
