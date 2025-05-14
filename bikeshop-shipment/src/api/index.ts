import { Router } from "express"
import routes from "./routes"

export default () => {
  const router = Router()
  routes(router)
  return router
}