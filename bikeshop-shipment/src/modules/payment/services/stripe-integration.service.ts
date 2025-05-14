import { TransactionBaseService } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import Stripe from "stripe"
import PaymentMethodService from "./payment-method.service"

type StripeIntegrationServiceProps = {
  paymentMethodService: PaymentMethodService
  stripeProviderService: any
}

class StripeIntegrationService extends TransactionBaseService {
  protected readonly paymentMethodService_: PaymentMethodService
  protected readonly stripeProviderService_: any
  protected readonly stripe_: Stripe

  constructor({ paymentMethodService, stripeProviderService }: StripeIntegrationServiceProps) {
    super(arguments[0])
    this.paymentMethodService_ = paymentMethodService
    this.stripeProviderService_ = stripeProviderService

    // Get Stripe instance from the provider
    this.stripe_ = this.stripeProviderService_.stripe_
  }

  async createSetupIntent(customerId: string): Promise<{ client_secret: string }> {
    try {
      const setupIntent = await this.stripe_.setupIntents.create({
        customer: customerId,
        payment_method_types: ["card"],
      })

      return { client_secret: setupIntent.client_secret }
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create setup intent: ${error.message}`
      )
    }
  }

  async listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe_.paymentMethods.list({
        customer: customerId,
        type: "card",
      })

      return paymentMethods.data
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to list payment methods: ${error.message}`
      )
    }
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe_.customers.create({
        email,
        name,
      })

      return customer
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create customer: ${error.message}`
      )
    }
  }

  async attachPaymentMethodToCustomer(
    paymentMethodId: string,
    customerId: string
  ): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe_.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      })

      return paymentMethod
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to attach payment method: ${error.message}`
      )
    }
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe_.paymentMethods.detach(paymentMethodId)
      return paymentMethod
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to detach payment method: ${error.message}`
      )
    }
  }

  async syncPaymentMethodToDatabase(
    stripePaymentMethod: Stripe.PaymentMethod,
    userId: string,
    isDefault: boolean = false
  ): Promise<any> {
    if (!stripePaymentMethod.card) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Payment method does not have card details"
      )
    }

    try {
      // Check if payment method already exists
      const existingPaymentMethods = await this.paymentMethodService_.list({
        provider: "stripe",
        provider_id: stripePaymentMethod.id,
      })

      if (existingPaymentMethods.length > 0) {
        // Update existing payment method
        return await this.paymentMethodService_.update(existingPaymentMethods[0].id, {
          card_last4: stripePaymentMethod.card.last4,
          card_brand: stripePaymentMethod.card.brand,
          card_exp_month: stripePaymentMethod.card.exp_month.toString(),
          card_exp_year: stripePaymentMethod.card.exp_year.toString(),
          is_default: isDefault,
        })
      } else {
        // Create new payment method
        return await this.paymentMethodService_.create({
          provider: "stripe",
          provider_id: stripePaymentMethod.id,
          card_last4: stripePaymentMethod.card.last4,
          card_brand: stripePaymentMethod.card.brand,
          card_exp_month: stripePaymentMethod.card.exp_month.toString(),
          card_exp_year: stripePaymentMethod.card.exp_year.toString(),
          is_default: isDefault,
          user_id: userId,
        })
      }
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        `Failed to sync payment method to database: ${error.message}`
      )
    }
  }
}

export default StripeIntegrationService