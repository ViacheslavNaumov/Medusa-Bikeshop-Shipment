"use client"

import { useState } from "react"
import { useAccount } from "@/lib/context/account-context"
import { Spinner } from "@medusajs/ui"
import { Button } from "@/components/common/button"
import Link from "next/link"
import { ArrowLeft } from "@medusajs/icons"
import { useRouter } from "next/navigation"
import { Input } from "@/components/common/input"
import { Textarea } from "@/components/common/textarea"
import { Select } from "@/components/common/select"

const carriers = [
  { value: "fedex", label: "FedEx" },
  { value: "ups", label: "UPS" },
  { value: "usps", label: "USPS" },
  { value: "dhl", label: "DHL" },
  { value: "other", label: "Other" },
]

export default function NewShipmentForm() {
  const { customer, isLoading: isLoadingCustomer } = useAccount()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    tracking_number: "",
    carrier: "",
    shipping_address: "",
    recipient_name: "",
    recipient_email: "",
    recipient_phone: "",
    notes: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customer) {
      setError("You must be logged in to create a shipment")
      return
    }

    // Validate required fields
    if (!formData.tracking_number || !formData.carrier || !formData.shipping_address || 
        !formData.recipient_name || !formData.recipient_email) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            user_id: customer.id,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create shipment")
      }

      const data = await response.json()
      
      // Redirect to the shipment details page
      router.push(`/shipments/${data.shipment.id}`)
    } catch (err) {
      console.error("Error creating shipment:", err)
      setError(err instanceof Error ? err.message : "Failed to create shipment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingCustomer) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <Spinner />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4">
        <p className="text-gray-500">Please log in to create a shipment</p>
        <Link href="/account">
          <Button>Go to account</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-8">
      <Link href="/shipments" className="flex items-center gap-x-2 text-ui-fg-base">
        <ArrowLeft size={16} />
        <span>Back to shipments</span>
      </Link>

      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="tracking_number" className="text-sm font-medium text-gray-700">
              Tracking Number *
            </label>
            <Input
              id="tracking_number"
              name="tracking_number"
              value={formData.tracking_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="carrier" className="text-sm font-medium text-gray-700">
              Carrier *
            </label>
            <Select
              id="carrier"
              name="carrier"
              value={formData.carrier}
              onChange={handleChange}
              required
            >
              <option value="">Select a carrier</option>
              {carriers.map((carrier) => (
                <option key={carrier.value} value={carrier.value}>
                  {carrier.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-y-2 md:col-span-2">
            <label htmlFor="shipping_address" className="text-sm font-medium text-gray-700">
              Shipping Address *
            </label>
            <Textarea
              id="shipping_address"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="recipient_name" className="text-sm font-medium text-gray-700">
              Recipient Name *
            </label>
            <Input
              id="recipient_name"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="recipient_email" className="text-sm font-medium text-gray-700">
              Recipient Email *
            </label>
            <Input
              id="recipient_email"
              name="recipient_email"
              type="email"
              value={formData.recipient_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="recipient_phone" className="text-sm font-medium text-gray-700">
              Recipient Phone
            </label>
            <Input
              id="recipient_phone"
              name="recipient_phone"
              value={formData.recipient_phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-y-2 md:col-span-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-x-2"
          >
            {isSubmitting && <Spinner size="small" />}
            Create Shipment
          </Button>
        </div>
      </form>
    </div>
  )
}