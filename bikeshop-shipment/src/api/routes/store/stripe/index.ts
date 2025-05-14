import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import { 
  createSetupIntent,
  listPaymentMethods,
  createCustomer,
  attachPaymentMethod,
  detachPaymentMethod
} from "./route-handlers"

const router = Router()

export default (storeRouter: Router) => {
  storeRouter.use("/stripe", router)

  router.post("/setup-intent", wrapHandler(createSetupIntent))
  router.get("/payment-methods/:customer_id", wrapHandler(listPaymentMethods))
  router.post("/customers", wrapHandler(createCustomer))
  router.post("/payment-methods/attach", wrapHandler(attachPaymentMethod))
  router.post("/payment-methods/detach", wrapHandler(detachPaymentMethod))

  return router
}