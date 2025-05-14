import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import { 
  getPaymentMethods,
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} from "./route-handlers"

const router = Router()

export default (adminRouter: Router) => {
  adminRouter.use("/payment-methods", router)

  router.get("/", wrapHandler(getPaymentMethods))
  router.get("/:id", wrapHandler(getPaymentMethod))
  router.post("/", wrapHandler(createPaymentMethod))
  router.put("/:id", wrapHandler(updatePaymentMethod))
  router.delete("/:id", wrapHandler(deletePaymentMethod))

  return router
}