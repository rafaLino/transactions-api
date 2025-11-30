import type {
	IInstallment,
	ITransaction,
	ITransactionInput
} from '@/interfaces'
import { YearMonthDate } from '@/valueObjects/yearMonthDate'

export function copyTransaction(
	date: YearMonthDate,
	existingTransaction: ITransaction
): ITransactionInput {
	const newDate = YearMonthDate.New(date)
	newDate.increaseMonth()

	const newItems = existingTransaction.items.map((item) => ({
		_id: undefined,
		name: item.name,
		value: item.value,
		persist: item.persist,
		installments: updateInstallments(item.installments)
	}))

	const newTransaction = {
		items: newItems,
		date: newDate.toString()
	}
	return newTransaction
}

function updateInstallments(installments: IInstallment | undefined) {
	if (!installments) return installments

	const { current, total } = installments

	if (current >= total) {
		return
	}

	return {
		current: current + 1,
		total: total
	}
}
