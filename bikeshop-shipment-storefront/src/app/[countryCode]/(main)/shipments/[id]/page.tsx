import { Metadata } from "next"
import { getServerSideConfig } from "@/lib/data/config"
import { getRegion } from "@/lib/data/region"
import ShipmentDetails from "./shipment-details"

type Props = {
  params: { countryCode: string; id: string }
}

export const metadata: Metadata = {
  title: "Shipment Details",
  description: "View your shipment details",
}

export default async function ShipmentDetailsPage({ params }: Props) {
  const config = await getServerSideConfig()
  const region = await getRegion(params.countryCode)

  if (!region) {
    return null
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 py-8">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">Shipment Details</h1>
            <ShipmentDetails id={params.id} />
          </div>
        </div>
      </div>
    </div>
  )
}