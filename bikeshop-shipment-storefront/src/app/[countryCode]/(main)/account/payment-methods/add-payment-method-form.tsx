"use client"

import { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/common/button"
import { Spinner } from "@medusajs/ui"

interface AddPaymentMethodFormProps {
  customerId: string
  onSuccess: (paymentMethod: any) => void
}

export default function AddPaymentMethodForm({
  customerId,
  onSuccess,
}: AddPaymentMethodFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Create a payment method with Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (!paymentMethod) {
        throw new Error("Failed to create payment method")
      }

      // Save the payment method to our backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-methods`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            provider_id: paymentMethod.id,
            data: {
              brand: paymentMethod.card?.brand,
              last4: paymentMethod.card?.last4,
              exp_month: paymentMethod.card?.exp_month,
              exp_year: paymentMethod.card?.exp_year,
            },
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save payment method")
      }

      const data = await response.json()
      
      // Clear the card element
      cardElement.clear()
      
      // Call the success callback
      onSuccess(data.payment_method)
    } catch (err) {
      console.error("Error adding payment method:", err)
      setError(err instanceof Error ? err.message : "Failed to add payment method")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="border rounded-md p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!stripe || isSubmitting}
          className="flex items-center gap-x-2"
        >
          {isSubmitting && <Spinner size="small" />}
          Add Payment Method
        </Button>
      </div>
    </form>
  )
}