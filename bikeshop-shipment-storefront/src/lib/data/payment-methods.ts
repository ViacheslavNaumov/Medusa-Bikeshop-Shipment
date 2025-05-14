import { medusaClient } from "@lib/config"

/**
 * Fetches all payment methods for the current user
 * @returns An array of payment methods
 */
export async function getPaymentMethods() {
  const { data } = await medusaClient.client.request("GET", "/store/payment-methods")
  return data.payment_methods
}

/**
 * Fetches a payment method by id
 * @param id - The id of the payment method to fetch
 * @returns The payment method
 */
export async function getPaymentMethod(id: string) {
  const { data } = await medusaClient.client.request("GET", `/store/payment-methods/${id}`)
  return data.payment_method
}

/**
 * Sets a payment method as default
 * @param id - The id of the payment method to set as default
 * @returns The updated payment method
 */
export async function setDefaultPaymentMethod(id: string) {
  const { data } = await medusaClient.client.request("POST", `/store/payment-methods/${id}/default`)
  return data.payment_method
}

/**
 * Deletes a payment method
 * @param id - The id of the payment method to delete
 * @returns The deleted payment method
 */
export async function deletePaymentMethod(id: string) {
  const { data } = await medusaClient.client.request("DELETE", `/store/payment-methods/${id}`)
  return data
}

/**
 * Creates a Stripe setup intent for adding a new payment method
 * @returns The setup intent
 */
export async function createStripeSetupIntent() {
  const { data } = await medusaClient.client.request("POST", "/store/stripe/payment-methods/setup-intent")
  return data.setup_intent
}