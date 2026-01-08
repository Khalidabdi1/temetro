"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">some thing wrong happen</h2>
      <p className="text-muted-foreground mt-2">{error.message}</p>

      <button
        onClick={() => reset()}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        إعادة المحاولة
      </button>
    </div>
  )
}
