import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { PaymentMethod } from "../models"

export const PaymentMethodRepository = dataSource
  .getRepository(PaymentMethod)
  .extend({
    async findByUserId(userId: string): Promise<PaymentMethod[]> {
      return this.find({
        where: {
          user_id: userId,
        },
        order: {
          is_default: "DESC",
          created_at: "DESC",
        },
      })
    },
    
    async findDefaultByUserId(userId: string): Promise<PaymentMethod | null> {
      return this.findOne({
        where: {
          user_id: userId,
          is_default: true,
        },
      })
    },

    async findByProviderAndProviderId(provider: string, providerId: string): Promise<PaymentMethod | null> {
      return this.findOne({
        where: {
          provider,
          provider_id: providerId,
        },
      })
    },
  })

export default PaymentMethodRepository