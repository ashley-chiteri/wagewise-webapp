import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
} 