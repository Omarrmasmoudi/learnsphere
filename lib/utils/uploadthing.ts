import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthingConfig"
 
// The route lives at app/api/uploadThings, not the library's default /api/uploadthing
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
  url: "/api/uploadThings",
})
