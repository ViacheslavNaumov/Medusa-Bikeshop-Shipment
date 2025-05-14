import { Lifetime } from "awilix"
import { ModuleRegistrationConfig } from "@medusajs/modules-sdk"
import { ShipmentRepository } from "./repository"
import ShipmentService from "./services/shipment.service"

export const config: ModuleRegistrationConfig = {
  imports: [
    {
      namespace: "shipment",
      register: {
        shipmentRepository: {
          resolve: () => ShipmentRepository,
          lifetime: Lifetime.SINGLETON,
        },
        shipmentService: {
          resolve: () => ShipmentService,
          lifetime: Lifetime.SCOPED,
        },
      },
    },
  ],
}

export * from "./models"