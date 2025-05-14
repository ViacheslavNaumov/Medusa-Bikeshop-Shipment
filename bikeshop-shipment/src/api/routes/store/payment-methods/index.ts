import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import { 
  getPaymentMethods,
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
} from "./route-handlers"

const router = Router()

export default (storeRouter: Router) => {
  storeRouter.use("/payment-methods", router)

  router.get("/", wrapHandler(getPaymentMethods))
  router.get("/:id", wrapHandler(getPaymentMethod))
  router.post("/", wrapHandler(createPaymentMethod))
  router.post("/:id/default", wrapHandler(setDefaultPaymentMethod))
  router.put("/:id", wrapHandler(updatePaymentMethod))
  router.delete("/:id", wrapHandler(deletePaymentMethod))

  return router
}