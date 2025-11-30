import { copyTransaction } from './helpers/copyTransaction'
import { Transaction } from './models/transaction'
import { BodySchema, DateBodySchema, DateParamSchema } from './schemas'
import type { FastifyTypedInstance } from './types/fastify'
import { YearMonthDate } from './valueObjects/yearMonthDate'

export async function routes(app: FastifyTypedInstance) {
	app.get(
		'/transactions/:date',
		{
			schema: {
				tags: ['Transactions'],
				params: DateParamSchema
			}
		},
		async (request, reply) => {
			const date = new YearMonthDate(request.params.date)
			const transaction = await Transaction.findOne({ date }).exec()

			if (!transaction)
				return reply.code(404).send({ message: 'Transaction not found' })

			return reply.code(200).send(transaction?.toJSON({ virtuals: true }))
		}
	)

	app.post(
		'/transactions',
		{
			schema: {
				tags: ['Transactions'],
				body: BodySchema
			}
		},
		async (request, reply) => {
			const date = new YearMonthDate(request.body.date)

			const existingData = await Transaction.findOne({ date }).exec()

			if (existingData) {
				return reply
					.code(400)
					.send({ message: 'Already exist transaction with this date' })
			}

			const transaction = new Transaction(request.body)

			await transaction.save()

			return reply.code(201).send(transaction)
		}
	)

	app.put(
		'/transactions',
		{
			schema: {
				tags: ['Transactions'],
				body: BodySchema
			}
		},
		async (request, reply) => {
			const date = new YearMonthDate(request.body.date)
			const result = await Transaction.updateOne({ date: date }, request.body)

			if (result.modifiedCount > 0) {
				return reply.code(204).send()
			}

			return reply.code(404).send({ message: 'Transaction not found' })
		}
	)

	app.delete(
		'/transactions/:date',
		{
			schema: {
				tags: ['Transactions'],
				params: DateParamSchema
			}
		},
		async (request, reply) => {
			const date = new YearMonthDate(request.params.date)
			const result = await Transaction.deleteOne({ date }).exec()
			const statusCode = result.deletedCount > 0 ? 204 : 404

			return reply.code(statusCode).send()
		}
	)

	app.post(
		'/transactions/next',
		{
			schema: {
				tags: ['Transactions'],
				body: DateBodySchema
			}
		},
		async (request, reply) => {
			const date = new YearMonthDate(request.body.date)
			const existingTransaction = await Transaction.findOne({ date }).exec()

			if (!existingTransaction) {
				return reply
					.code(404)
					.send({ message: 'Transaction not found from the given date.' })
			}

			const newTransaction = copyTransaction(
				date,
				existingTransaction.toObject()
			)

			const transaction = new Transaction(newTransaction)

			await transaction.save()

			return reply.code(201).send(transaction)
		}
	)
}
