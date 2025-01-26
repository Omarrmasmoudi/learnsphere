import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthingConfig"
 
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()