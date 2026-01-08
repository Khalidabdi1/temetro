import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
                <Image src={"/notfound.png"} width={300} height={300} alt="error photo"/>
        
      <h2 className="text-4xl font-bold">404 - Page Not Found</h2>
      <p className="text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <Button>Back</Button>
      </Link>
    </div>
  )
}