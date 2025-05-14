"use client"

import { useEffect, useState } from "react"
import { Button } from "@medusajs/ui"
import Link from "next/link"
import { ArrowLeft } from "@medusajs/icons"
import { getCustomer } from "@lib/data/customer"

interface Shipment {
  id: string
  tracking_number: string
  carrier: string
  shipping_address: string
  recipient_name: string
  recipient_email: string
  recipient_phone?: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

export default function ShipmentDetails({ id }: { id: string }) {
  const [customer, setCustomer] = useState(null)
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomerAndShipment = async () => {
      try {
        setIsLoading(true)
        
        // Get customer
        const customerResponse = await getCustomer()
        setCustomer(customerResponse)
        
        if (!customerResponse) {
          setIsLoading(false)
          return
        }

        // Fetch shipment
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipments/${id}`,
          {
            credentials: "include",
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch shipment details")
        }

        const data = await response.json()
        setShipment(data.shipment || null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load shipment details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerAndShipment()
  }, [id])

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
        <p className="text-gray-500">Please log in to view shipment details</p>
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

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4">
        <p className="text-gray-500">Shipment not found</p>
        <Link href="/shipments">
          <Button>Back to shipments</Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Shipment Information</h2>
          <div className="grid grid-cols-1 gap-y-4">
            <div>
              <p className="text-gray-500 text-sm">Tracking Number</p>
              <p className="font-medium">{shipment.tracking_number}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Carrier</p>
              <p className="font-medium">{shipment.carrier}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p className="font-medium">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  shipment.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  shipment.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  shipment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Created At</p>
              <p className="font-medium">{new Date(shipment.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Last Updated</p>
              <p className="font-medium">{new Date(shipment.updated_at).toLocaleString()}</p>
            </div>
            {shipment.notes && (
              <div>
                <p className="text-gray-500 text-sm">Notes</p>
                <p className="font-medium">{shipment.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recipient Information</h2>
          <div className="grid grid-cols-1 gap-y-4">
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="font-medium">{shipment.recipient_name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{shipment.recipient_email}</p>
            </div>
            {shipment.recipient_phone && (
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-medium">{shipment.recipient_phone}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 text-sm">Shipping Address</p>
              <p className="font-medium whitespace-pre-line">{shipment.shipping_address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Tracking Information</h2>
        <div className="flex flex-col gap-y-4">
          <p className="text-gray-500">
            You can track your shipment directly with the carrier using your tracking number.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                // Open carrier tracking page in a new tab
                let trackingUrl = "";
                switch (shipment.carrier.toLowerCase()) {
                  case "fedex":
                    trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${shipment.tracking_number}`;
                    break;
                  case "ups":
                    trackingUrl = `https://www.ups.com/track?tracknum=${shipment.tracking_number}`;
                    break;
                  case "usps":
                    trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${shipment.tracking_number}`;
                    break;
                  case "dhl":
                    trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${shipment.tracking_number}`;
                    break;
                  default:
                    // Generic tracking page
                    trackingUrl = `https://www.google.com/search?q=${encodeURIComponent(
                      `${shipment.carrier} tracking ${shipment.tracking_number}`
                    )}`;
                }
                window.open(trackingUrl, "_blank");
              }}
            >
              Track with {shipment.carrier}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(shipment.tracking_number);
                alert("Tracking number copied to clipboard!");
              }}
            >
              Copy Tracking Number
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}