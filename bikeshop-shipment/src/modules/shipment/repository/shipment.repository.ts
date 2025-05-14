import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { Shipment } from "../models"

export const ShipmentRepository = dataSource
  .getRepository(Shipment)
  .extend({
    async findByUserId(userId: string): Promise<Shipment[]> {
      return this.find({
        where: {
          user_id: userId,
        },
      })
    },
    
    async findByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
      return this.findOne({
        where: {
          tracking_number: trackingNumber,
        },
      })
    },
  })

export default ShipmentRepository