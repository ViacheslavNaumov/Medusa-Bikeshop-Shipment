import { Router } from "express"
import admin from "./admin"
import store from "./store"

export default () => {
  const router = Router()

  admin(router)
  store(router)

  return router
}