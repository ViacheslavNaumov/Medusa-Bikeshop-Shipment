"use client"

import { useEffect, useState } from "react"
import { Button } from "@medusajs/ui"
import Link from "next/link"
import { getCustomer } from "@lib/data/customer"
import { CreditCard, Plus, Trash } from "@medusajs/icons"

interface PaymentMethod {
  id: string
  card_last4: string
  card_brand: string
  card_exp_month: string
  card_exp_year: string
  is_default: boolean
  created_at: string
}

export default function PaymentMethodsList() {
  const [customer, setCustomer] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomerAndPaymentMethods = async () => {
      try {
        setIsLoading(true)
        
        // Get customer
        const customerResponse = await getCustomer()
        setCustomer(customerResponse)
        
        if (!customerResponse) {
          setIsLoading(false)
          return
        }

        // Fetch payment methods
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-methods?user_id=${customerResponse.id}`,
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
        console.error("Error fetching data:", err)
        setError("Failed to load payment methods. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerAndPaymentMethods()
  }, [])

  const handleAddPaymentMethod = async () => {
    try {
      // Redirect to Stripe payment method page
      window.location.href = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/stripe/payment-methods/create`
    } catch (err) {
      console.error("Error adding payment method:", err)
      setError("Failed to add payment method. Please try again later.")
    }
  }

  const handleDeletePaymentMethod = async (id: string) => {
    try {
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

      // Refresh payment methods
      setPaymentMethods(paymentMethods.filter(method => method.id !== id))
    } catch (err) {
      console.error("Error deleting payment method:", err)
      setError("Failed to delete payment method. Please try again later.")
    }
  }

  const handleSetDefaultPaymentMethod = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-methods/${id}/default`,
        {
          method: "POST",
          credentials: "include",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to set default payment method")
      }

      // Update payment methods
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        is_default: method.id === id
      })))
    } catch (err) {
      console.error("Error setting default payment method:", err)
      setError("Failed to set default payment method. Please try again later.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4">
        <p className="text-gray-500">Please log in to view your payment methods</p>
        <Link href="/account">
          <Button>Go to account</Button>
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4">
        <p className="text-rose-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex justify-end">
        <Button onClick={handleAddPaymentMethod}>
          <Plus size={16} />
          <span>Add Payment Method</span>
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4 bg-white p-6 border rounded-lg">
          <CreditCard size={32} className="text-gray-400" />
          <p className="text-gray-500">You don't have any payment methods yet</p>
          <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white p-6 border rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-x-2">
                  <CreditCard size={20} />
                  <span className="font-medium">{method.card_brand}</span>
                </div>
                {method.is_default && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Card Number</p>
                  <p className="font-medium">•••• •••• •••• {method.card_last4}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Expiration</p>
                  <p className="font-medium">{method.card_exp_month}/{method.card_exp_year}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Added On</p>
                  <p className="font-medium">{new Date(method.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-x-2 mt-2">
                  {!method.is_default && (
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash size={16} />
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}