import { DotPattern } from '~/components/magicui/dot-pattern'
import { cn } from "~/lib/utils"

export default function DotsPattern() {
  return <div className="absolute inset-0">
        <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
  </div>
} 