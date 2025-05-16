import { Metadata } from "next"
import { getServerSideConfig } from "@/lib/data/config"
import { getRegion } from "@/lib/data/region"
import NewShipmentForm from "./new-shipment-form"

type Props = {
  params: { countryCode: string }
}

export const metadata: Metadata = {
  title: "Create New Shipment",
  description: "Create a new shipment",
}

export default async function NewShipmentPage({ params }: Props) {
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
            <h1 className="text-2xl font-bold">Create New Shipment</h1>
            <NewShipmentForm />
          </div>
        </div>
      </div>
    </div>
  )
}