"use client"

import { useEffect, useState } from "react"
import { Button } from "@medusajs/ui"
import Link from "next/link"
import { ArrowLeft, CreditCard } from "@medusajs/icons"
import { getCustomer } from "@lib/data/customer"

interface PaymentMethod {
  id: string
  card_last4: string
  card_brand: string
  card_exp_month: string
  card_exp_year: string
  is_default: boolean
  created_at: string
  updated_at: string
  billing_details?: {
    address?: {
      city: string
      country: string
      line1: string
      line2?: string
      postal_code: string
      state?: string
    }
    email?: string
    name?: string
    phone?: string
  }
}

export default function PaymentMethodDetails({ id }: { id: string }) {
  const [customer, setCustomer] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomerAndPaymentMethod = async () => {
      try {
        setIsLoading(true)
        
        // Get customer
        const customerResponse = await getCustomer()
        setCustomer(customerResponse)
        
        if (!customerResponse) {
          setIsLoading(false)
          return
        }

        // Fetch payment method
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-methods/${id}`,
          {
            credentials: "include",
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch payment method details")
        }

        const data = await response.json()
        setPaymentMethod(data.payment_method || null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load payment method details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerAndPaymentMethod()
  }, [id])

  const handleSetDefaultPaymentMethod = async () => {
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

      // Update payment method
      setPaymentMethod({
        ...paymentMethod!,
        is_default: true
      })
    } catch (err) {
      console.error("Error setting default payment method:", err)
      setError("Failed to set default payment method. Please try again later.")
    }
  }

  const handleDeletePaymentMethod = async () => {
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

      // Redirect to payment methods list
      window.location.href = "/payment-methods"
    } catch (err) {
      console.error("Error deleting payment method:", err)
      setError("Failed to delete payment method. Please try again later.")
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
        <p className="text-gray-500">Please log in to view payment method details</p>
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

  if (!paymentMethod) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4">
        <p className="text-gray-500">Payment method not found</p>
        <Link href="/payment-methods">
          <Button>Back to payment methods</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-8">
      <Link href="/payment-methods" className="flex items-center gap-x-2 text-ui-fg-base">
        <ArrowLeft size={16} />
        <span>Back to payment methods</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 border rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-x-2">
              <CreditCard size={24} />
              <h2 className="text-xl font-semibold">{paymentMethod.card_brand} Card</h2>
            </div>
            {paymentMethod.is_default && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Default
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-y-4">
            <div>
              <p className="text-gray-500 text-sm">Card Number</p>
              <p className="font-medium">•••• •••• •••• {paymentMethod.card_last4}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Expiration</p>
              <p className="font-medium">{paymentMethod.card_exp_month}/{paymentMethod.card_exp_year}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Added On</p>
              <p className="font-medium">{new Date(paymentMethod.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Last Updated</p>
              <p className="font-medium">{new Date(paymentMethod.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {paymentMethod.billing_details && (
          <div className="bg-white p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 gap-y-4">
              {paymentMethod.billing_details.name && (
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-medium">{paymentMethod.billing_details.name}</p>
                </div>
              )}
              {paymentMethod.billing_details.email && (
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{paymentMethod.billing_details.email}</p>
                </div>
              )}
              {paymentMethod.billing_details.phone && (
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium">{paymentMethod.billing_details.phone}</p>
                </div>
              )}
              {paymentMethod.billing_details.address && (
                <div>
                  <p className="text-gray-500 text-sm">Billing Address</p>
                  <p className="font-medium">
                    {paymentMethod.billing_details.address.line1}
                    {paymentMethod.billing_details.address.line2 && `, ${paymentMethod.billing_details.address.line2}`}
                    <br />
                    {paymentMethod.billing_details.address.city}, 
                    {paymentMethod.billing_details.address.state && ` ${paymentMethod.billing_details.address.state},`} 
                    {paymentMethod.billing_details.address.postal_code}
                    <br />
                    {paymentMethod.billing_details.address.country}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        {!paymentMethod.is_default && (
          <Button 
            variant="secondary" 
            onClick={handleSetDefaultPaymentMethod}
          >
            Set as Default
          </Button>
        )}
        <Button 
          variant="danger" 
          onClick={handleDeletePaymentMethod}
        >
          Delete Payment Method
        </Button>
      </div>
    </div>
  )
}