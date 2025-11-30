import mongoose from 'mongoose'
import type { IInstallment, IRecord, ITransaction } from '@/interfaces'

const InstallmentSchema = new mongoose.Schema<IInstallment>(
	{
		current: { type: Number, required: true },
		total: { type: Number, required: true }
	},
	{ id: false }
)

const RecordSchema = new mongoose.Schema<IRecord>(
	{
		name: { type: String, required: true },
		value: { type: Number, required: true },
		persist: { type: Boolean, required: true, default: false },
		installments: InstallmentSchema
	},
	{ id: false }
)

const TransactionSchema = new mongoose.Schema<ITransaction>(
	{
		date: String,
		items: [RecordSchema]
	},
	{ id: false }
)

TransactionSchema.virtual('total').get(function () {
	return this.items.reduce((sum: number, item: IRecord) => sum + item.value, 0)
})

export const Transaction = mongoose.model('Transaction', TransactionSchema)
