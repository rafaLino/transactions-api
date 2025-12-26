import { buildApp } from './app'

async function main() {
	const app = await buildApp()
	const port = Number(process.env.PORT) || 3333
	app
		.listen({
			port: port,
			host: '0.0.0.0'
		})
		.then(() => {
			console.info(`HTTP server running on http://localhost:${port}`)
			console.info(`HTTP server running on http://localhost:${port}/docs`)
		})
}

main()
