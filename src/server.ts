import { buildApp } from './app'

async function main() {
	const app = await buildApp()
	app
		.listen({
			port: 3333,
			host: '0.0.0.0'
		})
		.then(() => {
			console.info('HTTP server running on http://localhost:3333')
			console.info('HTTP server running on http://localhost:3333/docs')
		})
}

main()
