import { Metadata } from "next"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { getBaseURL } from "@lib/util/env"
import AiChat from "@modules/ai/ai-chat"
import { getCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await getCustomer().catch(() => null)
  return (
    <>
      <Nav />
      {props.children}
      <Footer />
      {customer && <AiChat />}
    </>
  )
}
