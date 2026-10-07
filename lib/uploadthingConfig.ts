import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getCurrentUser } from "@/lib/action/auth"
import { canTeach } from "@/lib/auth/roles"

const f = createUploadthing()

// Uploads count against the app's UploadThing quota, so only teachers may upload.
// Runs on the upload request itself, before any file is accepted.
async function requireTeacher() {
  const user = await getCurrentUser()
  if (!user) throw new UploadThingError({ code: "FORBIDDEN", message: "Sign in to upload files" })
  if (!canTeach(user.role)) throw new UploadThingError({ code: "FORBIDDEN", message: "Only teachers can upload files" })
  return { userId: user.id }
}

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireTeacher)
    .onUploadComplete(async ({ file }) => {
      return { fileUrl: file.url }
    }),
    
  courseVideo: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(requireTeacher)
    .onUploadComplete(async ({ file }) => {
      return { fileUrl: file.url }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
