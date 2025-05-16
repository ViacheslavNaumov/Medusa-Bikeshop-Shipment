import { Metadata } from "next"
import { getServerSideConfig } from "@/lib/data/config"
import { getRegion } from "@/lib/data/region"
import PaymentMethodsList from "./payment-methods-list"

type Props = {
  params: { countryCode: string }
}

export const metadata: Metadata = {
  title: "Payment Methods",
  description: "Manage your payment methods",
}

export default async function PaymentMethodsPage({ params }: Props) {
  const config = await getServerSideConfig()
  const region = await getRegion(params.countryCode)

  if (!region) {
    return null
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <p className="text-gray-500 mt-2">
          Manage your payment methods for faster checkout
        </p>
      </div>
      <PaymentMethodsList />
    </div>
  )
}