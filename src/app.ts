import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
import dbConnector from './db/dbTursoConnector'
import { authentication } from './decorators/authenticationDecorator'
import { routes } from './routes'

export async function buildApp() {
	const app = fastify().withTypeProvider<ZodTypeProvider>()

	app.setValidatorCompiler(validatorCompiler)
	app.setSerializerCompiler(serializerCompiler)

	app.register(dbConnector, {
		url: process.env.DB_URI,
		token: process.env.DB_TOKEN
	})

	app.register(authentication)

	app.register(fastifyMultipart)

	app.register(fastifyCors, {
		origin: process.env.ALLOWED_ORIGIN?.split(',')
	})

	app.register(fastifySwagger, {
		openapi: {
			info: {
				title: 'Files API',
				version: '1.0.0'
			}
		},
		transform: jsonSchemaTransform
	})

	if (process.env.MODE === 'DEV') {
		app.register(ScalarApiReference, {
			routePrefix: '/docs'
		})
	}

	app.register(routes)

	await app.ready()

	return app
}
