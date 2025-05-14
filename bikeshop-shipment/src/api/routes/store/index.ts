import { Router } from "express"
import shipmentRoutes from "./shipments"
import paymentMethodRoutes from "./payment-methods"
import stripeRoutes from "./stripe"

export default (storeRouter: Router) => {
  shipmentRoutes(storeRouter)
  paymentMethodRoutes(storeRouter)
  stripeRoutes(storeRouter)
  return storeRouter
}