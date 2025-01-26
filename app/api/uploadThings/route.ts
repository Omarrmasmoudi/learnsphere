import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "@/lib/uploadthingConfig"

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})