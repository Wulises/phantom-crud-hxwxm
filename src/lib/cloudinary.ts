import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function subirImagenACloudinary(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const res = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'character' }, (error, result) => {
        if (error) return reject(error)
        resolve(result)
      })
      .end(buffer)
  })

  return res as { secure_url: string; public_id: string }
}
