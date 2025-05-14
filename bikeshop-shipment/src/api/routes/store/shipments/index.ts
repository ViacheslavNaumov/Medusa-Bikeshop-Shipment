import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import { 
  createShipment, 
  getShipment, 
  listShipments, 
  updateShipment, 
  deleteShipment 
} from "./shipment-handlers"
import { authenticate } from "@medusajs/medusa"

const router = Router()

export default (storeRouter: Router) => {
  storeRouter.use("/shipments", router)

  // Authenticated routes
  // router.use(authenticate())
  
  router.post("/", wrapHandler(createShipment))
  router.get("/", wrapHandler(listShipments))
  router.get("/:id", wrapHandler(getShipment))
  router.put("/:id", wrapHandler(updateShipment))
  router.delete("/:id", wrapHandler(deleteShipment))

  return router
}