import { BillsRoute } from './routes/bills.route'
import { FilesRoute } from './routes/files.route'
import type { FastifyTypedInstance } from './types/fastify'
export async function routes(app: FastifyTypedInstance) {
	FilesRoute.config(app)
	BillsRoute.config(app)
}
