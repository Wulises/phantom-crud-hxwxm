// src/app/api/characters/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

export async function DELETE(request: NextRequest) {
  try {
    const idStr = request.nextUrl.pathname.split('/').pop()
    const id = parseInt(idStr || '')

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const character = await prisma.character.findUnique({ where: { id } })

    if (!character) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    if (character.imagen) {
      try {
        const url = new URL(character.imagen)
        const parts = url.pathname.split('/')
        const uploadIndex = parts.findIndex((part) => part === 'upload')

        if (uploadIndex !== -1) {
          const publicIdWithExt = parts.slice(uploadIndex + 1).join('/')
          const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '')
          await cloudinary.uploader.destroy(publicId)
        }
      } catch (error) {
        console.error('Error al borrar imagen:', error)
      }
    }

    await prisma.character.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando personaje' }, { status: 500 })
  }
}
