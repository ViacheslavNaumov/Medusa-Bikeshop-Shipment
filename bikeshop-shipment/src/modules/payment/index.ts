import { PaymentMethod } from "./models"
import { PaymentMethodRepository } from "./repository/payment-method.repository"
import PaymentMethodService from "./services/payment-method.service"
import StripeIntegrationService from "./services/stripe-integration.service"

export const config = {
  service: {
    paymentMethodService: PaymentMethodService,
    stripeIntegrationService: StripeIntegrationService,
  },
  repository: {
    paymentMethodRepository: PaymentMethodRepository,
  },
  models: [PaymentMethod],
}