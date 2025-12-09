import { Router } from 'express'
import { remetenteSmtpController } from '../controllers/RemetenteSmtpController'
import { tenantSchema } from '../../../core/middlewares/tenantSchema'

export const remetenteSmtpRoutes = Router()

remetenteSmtpRoutes.get('/:schema/remetentes-smtp', tenantSchema, remetenteSmtpController.index)
remetenteSmtpRoutes.get('/:schema/remetentes-smtp/:id', tenantSchema, remetenteSmtpController.show)
remetenteSmtpRoutes.post('/:schema/remetentes-smtp', tenantSchema, remetenteSmtpController.store)
remetenteSmtpRoutes.put('/:schema/remetentes-smtp/:id', tenantSchema, remetenteSmtpController.update)
remetenteSmtpRoutes.delete('/:schema/remetentes-smtp/:id', tenantSchema, remetenteSmtpController.destroy)

