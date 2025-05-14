import { TransactionBaseService } from "@medusajs/medusa"
import { PaymentMethodRepository } from "../repository/payment-method.repository"
import { PaymentMethod } from "../models"
import { EntityManager } from "typeorm"
import { MedusaError } from "@medusajs/utils"
import { UserService } from "@medusajs/medusa"

type PaymentMethodServiceProps = {
  manager: EntityManager
  paymentMethodRepository: typeof PaymentMethodRepository
  userService: UserService
}

type CreatePaymentMethodInput = {
  provider: string
  provider_id: string
  card_last4?: string
  card_brand?: string
  card_exp_month?: string
  card_exp_year?: string
  is_default?: boolean
  user_id: string
}

type UpdatePaymentMethodInput = Partial<{
  card_last4: string
  card_brand: string
  card_exp_month: string
  card_exp_year: string
  is_default: boolean
}>

class PaymentMethodService extends TransactionBaseService {
  protected readonly paymentMethodRepository_: typeof PaymentMethodRepository
  protected readonly userService_: UserService

  constructor({ paymentMethodRepository, userService }: PaymentMethodServiceProps) {
    super(arguments[0])
    this.paymentMethodRepository_ = paymentMethodRepository
    this.userService_ = userService
  }

  async create(data: CreatePaymentMethodInput): Promise<PaymentMethod> {
    return this.atomicPhase_(async (manager) => {
      try {
        // Try to verify user exists, but don't fail if user service is not available
        if (this.userService_) {
          const user = await this.userService_.retrieve(data.user_id).catch(() => null)
          if (!user) {
            console.warn(`User with id ${data.user_id} not found, but continuing anyway for development`)
          }
        }
      } catch (error) {
        console.warn("Error verifying user, but continuing anyway for development:", error)
      }

      // Check if payment method already exists
      const existing = await this.paymentMethodRepository_.findByProviderAndProviderId(
        data.provider,
        data.provider_id
      )
      
      if (existing) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `Payment method with provider ${data.provider} and provider_id ${data.provider_id} already exists`
        )
      }

      // If this is set as default, unset any existing default
      if (data.is_default) {
        await this.unsetDefaultPaymentMethod(data.user_id)
      }

      const paymentMethodRepository = manager.withRepository(this.paymentMethodRepository_)
      const paymentMethod = paymentMethodRepository.create(data)
      return await paymentMethodRepository.save(paymentMethod)
    })
  }

  async retrieve(paymentMethodId: string): Promise<PaymentMethod> {
    const paymentMethodRepo = this.activeManager_.withRepository(this.paymentMethodRepository_)
    const paymentMethod = await paymentMethodRepo.findOne({
      where: { id: paymentMethodId },
    })

    if (!paymentMethod) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment method with id: ${paymentMethodId} was not found`
      )
    }

    return paymentMethod
  }

  async update(id: string, data: UpdatePaymentMethodInput): Promise<PaymentMethod> {
    return this.atomicPhase_(async (manager) => {
      const paymentMethodRepo = manager.withRepository(this.paymentMethodRepository_)
      const paymentMethod = await this.retrieve(id)

      // If setting as default, unset any existing default
      if (data.is_default) {
        await this.unsetDefaultPaymentMethod(paymentMethod.user_id)
      }

      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          paymentMethod[key] = value
        }
      }

      return await paymentMethodRepo.save(paymentMethod)
    })
  }

  async delete(id: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const paymentMethodRepo = manager.withRepository(this.paymentMethodRepository_)
      const paymentMethod = await this.retrieve(id)

      await paymentMethodRepo.remove(paymentMethod)
    })
  }

  async list(selector: any = {}, config: any = {}): Promise<PaymentMethod[]> {
    const paymentMethodRepo = this.activeManager_.withRepository(this.paymentMethodRepository_)
    return await paymentMethodRepo.find({
      where: selector,
      ...config,
    })
  }

  async listByUser(userId: string): Promise<PaymentMethod[]> {
    const paymentMethodRepo = this.activeManager_.withRepository(this.paymentMethodRepository_)
    return await paymentMethodRepo.findByUserId(userId)
  }

  async getDefaultPaymentMethod(userId: string): Promise<PaymentMethod | null> {
    const paymentMethodRepo = this.activeManager_.withRepository(this.paymentMethodRepository_)
    return await paymentMethodRepo.findDefaultByUserId(userId)
  }

  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
    return this.atomicPhase_(async (manager) => {
      const paymentMethodRepo = manager.withRepository(this.paymentMethodRepository_)
      const paymentMethod = await this.retrieve(id)

      // Unset any existing default
      await this.unsetDefaultPaymentMethod(paymentMethod.user_id)

      // Set this one as default
      paymentMethod.is_default = true
      return await paymentMethodRepo.save(paymentMethod)
    })
  }

  private async unsetDefaultPaymentMethod(userId: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const paymentMethodRepo = manager.withRepository(this.paymentMethodRepository_)
      const defaultPaymentMethod = await paymentMethodRepo.findDefaultByUserId(userId)

      if (defaultPaymentMethod) {
        defaultPaymentMethod.is_default = false
        await paymentMethodRepo.save(defaultPaymentMethod)
      }
    })
  }
}

export default PaymentMethodService