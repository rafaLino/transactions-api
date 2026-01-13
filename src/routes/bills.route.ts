import type { Client } from '@libsql/client'
import { z } from 'zod'
import { SQL } from '@/repository/queries'
import type { FastifyTypedInstance } from '@/types/fastify'
import { HttpStatusCode } from '@/types/httpStatusCode'

export const BillsRoute = {
	config
}

const billsArraySchema = z.array(
	z.object({
		id: z.string(),
		title: z.string(),
		amount: z.number(),
		tags: z.string().transform((val) => (val ? val.split(',') : []))
	})
)

async function config(app: FastifyTypedInstance) {
	app.get(
		'/bills/users',
		{
			schema: {
				tags: ['bills', 'users']
			}
		},
		async (_, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute(SQL.users.GET_ALL)

			return reply.code(HttpStatusCode.OK).send(result.rows)
		}
	)

	app.post(
		'/bills/users',
		{
			schema: {
				tags: ['bills', 'users'],
				body: z.object({
					name: z.string(),
					amount: z.number()
				})
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute({
				sql: SQL.users.INSERT_ONE,
				args: [request.body.name, request.body.amount]
			})

			const statusCode =
				result.rowsAffected > 0
					? HttpStatusCode.CREATED
					: HttpStatusCode.BADREQUEST

			return reply
				.code(statusCode)
				.send({ id: result.lastInsertRowid?.toString() })
		}
	)

	app.put(
		'/bills/users/:id',
		{
			schema: {
				tags: ['bills', 'users'],
				params: z.object({
					id: z.coerce.number()
				}),
				body: z.object({
					amount: z.number()
				})
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute({
				sql: SQL.users.UPDATE_ONE,
				args: [request.body.amount, request.params.id]
			})

			const statusCode =
				result.rowsAffected > 0
					? HttpStatusCode.NOCONTENT
					: HttpStatusCode.BADREQUEST

			return reply.code(statusCode).send()
		}
	)

	app.delete(
		'/bills/users/:id',
		{
			schema: {
				tags: ['bills', 'users'],
				params: z.object({
					id: z.coerce.number()
				})
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute({
				sql: SQL.users.DELETE_ONE,
				args: [request.params.id]
			})

			const statusCode =
				result.rowsAffected > 0
					? HttpStatusCode.NOCONTENT
					: HttpStatusCode.NOTFOUND

			return reply.code(statusCode).send()
		}
	)

	app.get(
		'/bills',
		{
			schema: {
				tags: ['bills']
			}
		},
		async (_, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute(SQL.bills.GET_ALL)

			const billsResults = billsArraySchema.parse(result.rows)

			return reply.code(HttpStatusCode.OK).send(billsResults)
		}
	)

	app.post(
		'/bills',
		{
			schema: {
				tags: ['bills'],
				body: z.object({
					id: z.string(),
					title: z.string(),
					amount: z.number(),
					tags: z.string().array().default([])
				})
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute({
				sql: SQL.bills.INSERT_ONE,
				args: [
					request.body.id,
					request.body.title,
					request.body.amount,
					request.body.tags.join(',')
				]
			})

			const statusCode =
				result.rowsAffected > 0
					? HttpStatusCode.CREATED
					: HttpStatusCode.BADREQUEST

			return reply.code(statusCode).send()
		}
	)

	app.put(
		'/bills/:id',
		{
			schema: {
				tags: ['bills'],
				params: z.object({
					id: z.string()
				}),
				body: z.object({
					title: z.string(),
					amount: z.number(),
					tags: z.string().array().default([])
				})
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute({
				sql: SQL.bills.UPDATE_ONE,
				args: [
					request.body.title,
					request.body.amount,
					request.body.tags.join(','),
					request.params.id
				]
			})

			const statusCode =
				result.rowsAffected > 0
					? HttpStatusCode.NOCONTENT
					: HttpStatusCode.BADREQUEST

			return reply.code(statusCode).send()
		}
	)

	app.delete(
		'/bills/:id',
		{
			schema: {
				tags: ['bills'],
				params: z.object({
					id: z.string()
				})
			}
		},
		async (request, reply) => {
			const turso = app.getDecorator<Client>('turso')
			const result = await turso.execute({
				sql: SQL.bills.DELETE_ONE,
				args: [request.params.id]
			})

			const statusCode =
				result.rowsAffected > 0
					? HttpStatusCode.NOCONTENT
					: HttpStatusCode.NOTFOUND

			return reply.code(statusCode).send()
		}
	)
}
