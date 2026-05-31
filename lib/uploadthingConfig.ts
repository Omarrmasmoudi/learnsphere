import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata: _metadata, file }) => {
      return { fileUrl: file.url }
    }),
    
  courseVideo: f({ video: { maxFileSize: "512MB" } })
    .onUploadComplete(async ({ metadata: _metadata, file }) => {
      return { fileUrl: file.url }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter