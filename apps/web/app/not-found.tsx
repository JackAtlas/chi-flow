import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          别担心，即使是最棒的数据，有时也会在互联网中迷失。
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/80"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            回到仪表盘
          </Link>
        </div>
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        如果您认为这出错了，请联系我们的客服团队。
      </footer>
    </div>
  )
}
