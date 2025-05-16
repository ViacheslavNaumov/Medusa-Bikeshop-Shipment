"use client"

import { useEffect, useState } from "react"
import { useAccount } from "@/lib/context/account-context"
import { Spinner } from "@medusajs/ui"
import { Button } from "@/components/common/button"
import Link from "next/link"
import { medusaClient } from "@/lib/config"

interface Shipment {
  id: string
  tracking_number: string
  carrier: string
  shipping_address: string
  recipient_name: string
  recipient_email: string
  recipient_phone?: string
  status: string
  created_at: string
  updated_at: string
}

export default function ShipmentsList() {
  const { customer, isLoading: isLoadingCustomer } = useAccount()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShipments = async () => {
      if (!customer) return

      try {
        setIsLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipments?user_id=${customer.id}`,
          {
            credentials: "include",
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch shipments")
        }

        const data = await response.json()
        setShipments(data.shipments || [])
      } catch (err) {
        console.error("Error fetching shipments:", err)
        setError("Failed to load shipments. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (customer) {
      fetchShipments()
    }
  }, [customer])

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
        <p className="text-gray-500">Please log in to view your shipments</p>
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

  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 gap-y-4">
        <p className="text-gray-500">You don't have any shipments yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carrier
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {shipment.tracking_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {shipment.carrier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    shipment.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    shipment.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    shipment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(shipment.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/shipments/${shipment.id}`}>
                    <Button variant="secondary" size="small">View Details</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}