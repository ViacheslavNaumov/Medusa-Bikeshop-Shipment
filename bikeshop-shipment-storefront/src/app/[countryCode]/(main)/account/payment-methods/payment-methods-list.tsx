"use client"

import { useEffect, useState } from "react"
import { useAccount } from "@/lib/context/account-context"
import { Spinner } from "@medusajs/ui"
import { Button } from "@/components/common/button"
import { PlusCircle, Trash } from "@medusajs/icons"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import AddPaymentMethodForm from "./add-payment-method-form"

interface PaymentMethod {
  id: string
  customer_id: string
  provider_id: string
  data: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  created_at: string
  updated_at: string
}

export default function PaymentMethodsList() {
  const { customer, isLoading: isLoadingCustomer } = useAccount()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [stripePromise, setStripePromise] = useState<any>(null)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY))
    }
  }, [])

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!customer) return

      try {
        setIsLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-methods?customer_id=${customer.id}`,
          {
            credentials: "include",
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch payment methods")
        }

        const data = await response.json()
        setPaymentMethods(data.payment_methods || [])
      } catch (err) {
        console.error("Error fetching payment methods:", err)
        setError("Failed to load payment methods. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (customer) {
      fetchPaymentMethods()
    }
  }, [customer])

  const handleDelete = async (id: string) => {
    if (!customer) return

    try {
      setIsDeleting(id)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-methods/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete payment method")
      }

      // Remove the deleted payment method from the list
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id))
    } catch (err) {
      console.error("Error deleting payment method:", err)
      setError("Failed to delete payment method. Please try again later.")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleAddSuccess = (newMethod: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, newMethod])
    setShowAddForm(false)
  }

  if (isLoadingCustomer || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <Spinner />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4">
        <p className="text-gray-500">Please log in to view your payment methods</p>
      </div>
    )
  }

  if (error && !showAddForm) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4">
        <p className="text-rose-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-8">
      {paymentMethods.length === 0 && !showAddForm ? (
        <div className="flex flex-col items-center justify-center w-full py-16 border rounded-lg">
          <p className="text-gray-500 mb-4">You don't have any payment methods yet</p>
          <Button
            variant="secondary"
            className="flex items-center gap-x-2"
            onClick={() => setShowAddForm(true)}
          >
            <PlusCircle size={16} />
            Add Payment Method
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Payment Methods</h2>
            {!showAddForm && (
              <Button
                variant="secondary"
                className="flex items-center gap-x-2"
                onClick={() => setShowAddForm(true)}
              >
                <PlusCircle size={16} />
                Add New
              </Button>
            )}
          </div>

          {showAddForm && stripePromise && (
            <div className="bg-white p-6 border rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add Payment Method</h3>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
              <Elements stripe={stripePromise}>
                <AddPaymentMethodForm
                  customerId={customer.id}
                  onSuccess={handleAddSuccess}
                />
              </Elements>
            </div>
          )}

          {paymentMethods.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white p-6 border rounded-lg flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-x-2">
                      <span className="font-medium capitalize">
                        {method.data.brand}
                      </span>
                      <span className="text-gray-500">•••• {method.data.last4}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      Expires {method.data.exp_month}/{method.data.exp_year}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="small"
                    className="flex items-center gap-x-2"
                    onClick={() => handleDelete(method.id)}
                    disabled={isDeleting === method.id}
                  >
                    {isDeleting === method.id ? (
                      <Spinner size="small" />
                    ) : (
                      <Trash size={16} />
                    )}
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}