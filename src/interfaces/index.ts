import type { YearMonthDate } from '@/valueObjects/yearMonthDate'

export interface ITransaction {
	date: string
	items: IRecord[]
}

export interface IInstallment {
	current: number
	total: number
}
export interface IRecord {
	name: string
	value: number
	persist: boolean
	installments?: IInstallment
}

export interface ITransactionInput {
	date: string
	items: IRecord[]
}
