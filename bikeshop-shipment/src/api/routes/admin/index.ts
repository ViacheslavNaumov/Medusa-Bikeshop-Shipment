import { Router } from "express"
import shipmentRoutes from "./shipments"
import paymentMethodRoutes from "./payment-methods"

export default (adminRouter: Router) => {
  shipmentRoutes(adminRouter)
  paymentMethodRoutes(adminRouter)
  return adminRouter
}