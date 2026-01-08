import { Suspense } from "react"
import { ErrorClient } from "./error-client"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ErrorClient />
    </Suspense>
  )
}
