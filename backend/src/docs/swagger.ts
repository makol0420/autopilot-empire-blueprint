import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'SaaS Backend API',
			version: '1.0.0',
			description: 'API documentation for the subscription-based SaaS backend'
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			},
			schemas: {
				User: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						email: { type: 'string' },
						name: { type: 'string', nullable: true },
						role: { type: 'string', enum: ['USER', 'ADMIN'] },
						emailVerifiedAt: { type: 'string', format: 'date-time', nullable: true },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' }
					},
					example: {
						id: 'usr_123',
						email: 'user@example.com',
						name: 'Jane Doe',
						role: 'USER',
						emailVerifiedAt: null,
						createdAt: '2025-01-01T00:00:00.000Z',
						updatedAt: '2025-01-01T00:00:00.000Z'
					}
				},
				Subscription: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						userId: { type: 'string' },
						stripeSubscriptionId: { type: 'string' },
						priceId: { type: 'string' },
						status: { type: 'string' },
						currentPeriodEnd: { type: 'string', format: 'date-time', nullable: true },
						cancelAtPeriodEnd: { type: 'boolean' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' }
					},
					example: {
						id: 'sub_123',
						userId: 'usr_123',
						stripeSubscriptionId: 'sub_abc',
						priceId: 'price_123',
						status: 'ACTIVE',
						currentPeriodEnd: '2025-02-01T00:00:00.000Z',
						cancelAtPeriodEnd: false,
						createdAt: '2025-01-01T00:00:00.000Z',
						updatedAt: '2025-01-01T00:00:00.000Z'
					}
				},
				AuthResponse: {
					type: 'object',
					properties: {
						user: { $ref: '#/components/schemas/User' },
						token: { type: 'string' }
					},
					example: {
						user: {
							id: 'usr_123',
							email: 'user@example.com',
							name: 'Jane Doe',
							role: 'USER',
							emailVerifiedAt: null,
							createdAt: '2025-01-01T00:00:00.000Z',
							updatedAt: '2025-01-01T00:00:00.000Z'
						},
						token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
					}
				},
				ErrorResponse: {
					type: 'object',
					required: ['error'],
					properties: { error: { type: 'string' } },
					example: { error: 'Bad Request' }
				}
			}
		},
		servers: [
			{ url: '/api' }
		],
		paths: {
			'/health': {
				get: {
					summary: 'Health check',
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' } } }, example: { ok: true } } } } }
				}
			},
			'/auth/signup': {
				post: {
					summary: 'User signup',
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									type: 'object',
									required: ['email', 'password'],
									properties: {
										email: { type: 'string', example: 'user@example.com' },
										password: { type: 'string', example: 'StrongPassw0rd' },
										name: { type: 'string', example: 'Jane Doe' }
									}
								}
							}
						}
					},
					responses: {
						'201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' }, example: { user: { id: 'usr_123', email: 'user@example.com', name: 'Jane Doe', role: 'USER', emailVerifiedAt: null, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' }, token: 'ey...' } } } },
						'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
					}
				}
			},
			'/auth/login': {
				post: {
					summary: 'User login',
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									type: 'object',
									required: ['email', 'password'],
									properties: {
										email: { type: 'string', example: 'user@example.com' },
										password: { type: 'string', example: 'StrongPassw0rd' }
									}
								}
							}
						}
					},
					responses: {
						'200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' }, example: { user: { id: 'usr_123', email: 'user@example.com', name: 'Jane Doe', role: 'USER', emailVerifiedAt: null, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' }, token: 'ey...' } } } },
						'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
					}
				}
			},
			'/auth/me': {
				get: {
					summary: 'Get current user',
					security: [{ bearerAuth: [] }],
					responses: {
						'200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' }, example: { id: 'usr_123', email: 'user@example.com', name: 'Jane Doe', role: 'USER', emailVerifiedAt: null, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' } } } },
						'401': { description: 'Unauthorized' }
					}
				}
			},
			'/auth/verify-email': {
				get: {
					summary: 'Verify email by token',
					parameters: [ { in: 'query', name: 'token', required: true, schema: { type: 'string' } } ],
					responses: {
						'200': { description: 'Verified', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } }, example: { message: 'Email verified' } } } },
						'400': { description: 'Bad Request' }
					}
				}
			},
			'/billing/checkout': {
				post: {
					summary: 'Create Stripe Checkout session',
					security: [{ bearerAuth: [] }],
					responses: {
						'200': { description: 'Ok', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string' } } }, example: { url: 'https://checkout.stripe.com/c/pay/cs_test_...' } } } },
						'400': { description: 'Bad Request' },
						'401': { description: 'Unauthorized' }
					}
				}
			},
			'/billing/webhook': {
				post: {
					summary: 'Stripe Webhook endpoint',
					responses: {
						'200': { description: 'Ok' },
						'400': { description: 'Signature invalid' }
					}
				}
			},
			'/admin/users': {
				get: {
					summary: 'List users',
					security: [{ bearerAuth: [] }],
					responses: {
						'200': { description: 'Ok', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }, example: [ { id: 'usr_123', email: 'user@example.com', name: 'Jane Doe', role: 'USER', emailVerifiedAt: null, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' } ] } } },
						'401': { description: 'Unauthorized' },
						'403': { description: 'Forbidden' }
					}
				}
			},
			'/admin/subscriptions': {
				get: {
					summary: 'List subscriptions',
					security: [{ bearerAuth: [] }],
					responses: {
						'200': { description: 'Ok', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Subscription' } }, example: [ { id: 'sub_123', userId: 'usr_123', stripeSubscriptionId: 'sub_abc', priceId: 'price_123', status: 'ACTIVE', currentPeriodEnd: '2025-02-01T00:00:00.000Z', cancelAtPeriodEnd: false, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' } ] } } },
						'401': { description: 'Unauthorized' },
						'403': { description: 'Forbidden' }
					}
				}
			}
		}
	},
	apis: []
});