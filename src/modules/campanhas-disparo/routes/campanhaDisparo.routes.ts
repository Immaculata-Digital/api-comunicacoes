import { Router } from 'express'
import { campanhaDisparoController } from '../controllers/CampanhaDisparoController'
import { tenantSchema } from '../../../core/middlewares/tenantSchema'

export const campanhaDisparoRoutes = Router()

campanhaDisparoRoutes.get('/:schema/campanhas-disparo', tenantSchema, campanhaDisparoController.index)
campanhaDisparoRoutes.get('/:schema/campanhas-disparo/:id', tenantSchema, campanhaDisparoController.show)
campanhaDisparoRoutes.post('/:schema/campanhas-disparo', tenantSchema, campanhaDisparoController.store)
campanhaDisparoRoutes.put('/:schema/campanhas-disparo/:id', tenantSchema, campanhaDisparoController.update)
campanhaDisparoRoutes.delete('/:schema/campanhas-disparo/:id', tenantSchema, campanhaDisparoController.destroy)
campanhaDisparoRoutes.post('/:schema/campanhas-disparo/:id/enviar', tenantSchema, campanhaDisparoController.enviar)

