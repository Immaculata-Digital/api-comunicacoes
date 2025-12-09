import { Router } from 'express'
import { remetenteSmtpRoutes } from '../modules/remetentes-smtp/routes/remetenteSmtp.routes'
import { campanhaDisparoRoutes } from '../modules/campanhas-disparo/routes/campanhaDisparo.routes'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Comunicações está funcionando' })
})

router.use(remetenteSmtpRoutes)
router.use(campanhaDisparoRoutes)

export { router as routes }

