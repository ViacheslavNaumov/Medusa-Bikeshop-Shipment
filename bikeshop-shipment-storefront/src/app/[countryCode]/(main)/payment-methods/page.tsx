import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import PaymentMethodsList from "./payment-methods-list"

type Props = {
  params: { countryCode: string }
}

export const metadata: Metadata = {
  title: "Payment Methods",
  description: "Manage your payment methods",
}

export default async function PaymentMethodsPage({ params }: Props) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    return null
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8 py-8">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">Your Payment Methods</h1>
            <PaymentMethodsList />
          </div>
        </div>
      </div>
    </div>
  )
}