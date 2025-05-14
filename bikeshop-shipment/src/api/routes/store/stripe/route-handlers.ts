import { Request, Response } from "express"
import StripeIntegrationService from "../../../../modules/payment/services/stripe-integration.service"

/**
 * @schema CreateSetupIntentBody
 * type: object
 * required:
 *   - customer_id
 * properties:
 *   customer_id:
 *     type: string
 *     description: The Stripe customer ID
 */
export async function createSetupIntent(req: Request, res: Response) {
  const { customer_id } = req.body

  if (!customer_id) {
    return res.status(400).json({
      message: "customer_id is required",
    })
  }

  const stripeIntegrationService: StripeIntegrationService = req.scope.resolve("stripeIntegrationService")
  const setupIntent = await stripeIntegrationService.createSetupIntent(customer_id)

  return res.json(setupIntent)
}

/**
 * @schema ListPaymentMethodsParams
 * type: object
 * required:
 *   - customer_id
 * properties:
 *   customer_id:
 *     type: string
 *     description: The Stripe customer ID
 */
export async function listPaymentMethods(req: Request, res: Response) {
  const { customer_id } = req.params

  if (!customer_id) {
    return res.status(400).json({
      message: "customer_id is required",
    })
  }

  const stripeIntegrationService: StripeIntegrationService = req.scope.resolve("stripeIntegrationService")
  const paymentMethods = await stripeIntegrationService.listPaymentMethods(customer_id)

  return res.json({ payment_methods: paymentMethods })
}

/**
 * @schema CreateCustomerBody
 * type: object
 * required:
 *   - email
 * properties:
 *   email:
 *     type: string
 *     description: The customer's email
 *   name:
 *     type: string
 *     description: The customer's name
 */
export async function createCustomer(req: Request, res: Response) {
  const { email, name } = req.body

  if (!email) {
    return res.status(400).json({
      message: "email is required",
    })
  }

  const stripeIntegrationService: StripeIntegrationService = req.scope.resolve("stripeIntegrationService")
  const customer = await stripeIntegrationService.createCustomer(email, name)

  return res.json({ customer })
}

/**
 * @schema AttachPaymentMethodBody
 * type: object
 * required:
 *   - payment_method_id
 *   - customer_id
 *   - user_id
 * properties:
 *   payment_method_id:
 *     type: string
 *     description: The Stripe payment method ID
 *   customer_id:
 *     type: string
 *     description: The Stripe customer ID
 *   user_id:
 *     type: string
 *     description: The Medusa user ID
 *   is_default:
 *     type: boolean
 *     description: Whether this payment method should be the default
 */
export async function attachPaymentMethod(req: Request, res: Response) {
  const { payment_method_id, customer_id, user_id: bodyUserId, is_default = false } = req.body
  const user_id = req.user?.userId || bodyUserId || "test-user-id"

  if (!payment_method_id || !customer_id || !user_id) {
    return res.status(400).json({
      message: "payment_method_id, customer_id, and user_id are required",
    })
  }

  const stripeIntegrationService: StripeIntegrationService = req.scope.resolve("stripeIntegrationService")
  
  // Attach payment method to customer in Stripe
  const stripePaymentMethod = await stripeIntegrationService.attachPaymentMethodToCustomer(
    payment_method_id,
    customer_id
  )

  // Sync payment method to database
  const paymentMethod = await stripeIntegrationService.syncPaymentMethodToDatabase(
    stripePaymentMethod,
    user_id,
    is_default
  )

  return res.json({ payment_method: paymentMethod })
}

/**
 * @schema DetachPaymentMethodBody
 * type: object
 * required:
 *   - payment_method_id
 * properties:
 *   payment_method_id:
 *     type: string
 *     description: The Stripe payment method ID
 */
export async function detachPaymentMethod(req: Request, res: Response) {
  const { payment_method_id } = req.body

  if (!payment_method_id) {
    return res.status(400).json({
      message: "payment_method_id is required",
    })
  }

  const stripeIntegrationService: StripeIntegrationService = req.scope.resolve("stripeIntegrationService")
  await stripeIntegrationService.detachPaymentMethod(payment_method_id)

  return res.status(204).end()
}