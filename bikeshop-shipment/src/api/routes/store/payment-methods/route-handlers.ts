import { Request, Response } from "express"
import PaymentMethodService from "../../../../modules/payment/services/payment-method.service"

/**
 * @schema GetPaymentMethodsParams
 * type: object
 * required:
 *   - user_id
 * properties:
 *   user_id:
 *     type: string
 *     description: The ID of the user to get payment methods for
 */
export async function getPaymentMethods(req: Request, res: Response) {
  // Get the current user from the request or use query param
  const user_id = req.user?.userId || req.query.user_id

  if (!user_id) {
    return res.status(400).json({
      message: "user_id is required",
    })
  }

  const paymentMethodService: PaymentMethodService = req.scope.resolve("paymentMethodService")
  const paymentMethods = await paymentMethodService.listByUser(user_id as string)

  return res.json({ payment_methods: paymentMethods })
}

/**
 * @schema GetPaymentMethodParams
 * type: object
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the payment method
 */
export async function getPaymentMethod(req: Request, res: Response) {
  const { id } = req.params

  const paymentMethodService: PaymentMethodService = req.scope.resolve("paymentMethodService")
  const paymentMethod = await paymentMethodService.retrieve(id)

  return res.json({ payment_method: paymentMethod })
}

/**
 * @schema CreatePaymentMethodBody
 * type: object
 * required:
 *   - provider
 *   - provider_id
 *   - user_id
 * properties:
 *   provider:
 *     type: string
 *     description: The payment provider (e.g., "stripe")
 *   provider_id:
 *     type: string
 *     description: The ID of the payment method in the provider's system
 *   card_last4:
 *     type: string
 *     description: The last 4 digits of the card
 *   card_brand:
 *     type: string
 *     description: The brand of the card (e.g., "visa", "mastercard")
 *   card_exp_month:
 *     type: string
 *     description: The expiration month of the card
 *   card_exp_year:
 *     type: string
 *     description: The expiration year of the card
 *   is_default:
 *     type: boolean
 *     description: Whether this payment method should be the default
 *   user_id:
 *     type: string
 *     description: The ID of the user this payment method belongs to
 */
export async function createPaymentMethod(req: Request, res: Response) {
  const {
    provider,
    provider_id,
    card_last4,
    card_brand,
    card_exp_month,
    card_exp_year,
    is_default,
    user_id,
  } = req.body

  // Use the user ID from the request if available, otherwise use the one from the body
  const currentUserId = req.user?.userId || user_id || "test-user-id"

  if (!provider || !provider_id) {
    return res.status(400).json({
      message: "provider and provider_id are required",
    })
  }

  const paymentMethodService: PaymentMethodService = req.scope.resolve("paymentMethodService")
  const paymentMethod = await paymentMethodService.create({
    provider,
    provider_id,
    card_last4,
    card_brand,
    card_exp_month,
    card_exp_year,
    is_default,
    user_id: currentUserId,
  })

  return res.status(201).json({ payment_method: paymentMethod })
}

/**
 * @schema UpdatePaymentMethodParams
 * type: object
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the payment method
 */
/**
 * @schema UpdatePaymentMethodBody
 * type: object
 * properties:
 *   card_last4:
 *     type: string
 *     description: The last 4 digits of the card
 *   card_brand:
 *     type: string
 *     description: The brand of the card (e.g., "visa", "mastercard")
 *   card_exp_month:
 *     type: string
 *     description: The expiration month of the card
 *   card_exp_year:
 *     type: string
 *     description: The expiration year of the card
 *   is_default:
 *     type: boolean
 *     description: Whether this payment method should be the default
 */
export async function updatePaymentMethod(req: Request, res: Response) {
  const { id } = req.params
  const {
    card_last4,
    card_brand,
    card_exp_month,
    card_exp_year,
    is_default,
  } = req.body

  const paymentMethodService: PaymentMethodService = req.scope.resolve("paymentMethodService")
  const paymentMethod = await paymentMethodService.update(id, {
    card_last4,
    card_brand,
    card_exp_month,
    card_exp_year,
    is_default,
  })

  return res.json({ payment_method: paymentMethod })
}

/**
 * @schema DeletePaymentMethodParams
 * type: object
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the payment method
 */
export async function deletePaymentMethod(req: Request, res: Response) {
  const { id } = req.params

  const paymentMethodService: PaymentMethodService = req.scope.resolve("paymentMethodService")
  await paymentMethodService.delete(id)

  return res.status(204).end()
}

/**
 * @schema SetDefaultPaymentMethodParams
 * type: object
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the payment method
 */
export async function setDefaultPaymentMethod(req: Request, res: Response) {
  const { id } = req.params

  const paymentMethodService: PaymentMethodService = req.scope.resolve("paymentMethodService")
  const paymentMethod = await paymentMethodService.setDefaultPaymentMethod(id)

  return res.json({ payment_method: paymentMethod })
}