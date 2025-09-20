import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subirImagenACloudinary } from '@/lib/cloudinary'

export async function GET() {
  const characters = await prisma.character.findMany()
  return NextResponse.json(characters)
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const nombre = formData.get('nombre') as string | null
  const edadStr = formData.get('edad') as string | null
  const file = formData.get('imagen') as File | null

  if (!nombre || !edadStr) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  let imagePath = ''
  if (file && file instanceof Blob) {
    try {
      const result = await subirImagenACloudinary(file)
      imagePath = result.secure_url
    } catch (error) {
      return NextResponse.json({ error: 'Error subiendo imagen' }, { status: 500 })
    }
  }

  const edad = parseInt(edadStr)
  const nuevo = await prisma.character.create({
    data: { nombre, edad, imagen: imagePath },
  })

  return NextResponse.json(nuevo)
}

export async function PUT(req: NextRequest) {
  const formData = await req.formData()
  const idStr = formData.get('id')
  const nombre = formData.get('nombre')
  const edadStr = formData.get('edad')
  const file = formData.get('imagen') as File | null

  if (!idStr || typeof idStr !== 'string') {
    return NextResponse.json({ error: 'Falta el ID' }, { status: 400 })
  }

  const id = Number(idStr)
  const character = await prisma.character.findUnique({ where: { id } })

  if (!character) {
    return NextResponse.json({ error: 'Personaje no encontrado' }, { status: 404 })
  }

  let imagePath = character.imagen
  if (file && file.size > 0) {
    try {
      const result = await subirImagenACloudinary(file)
      imagePath = result.secure_url
    } catch (error) {
      return NextResponse.json({ error: 'Error subiendo imagen' }, { status: 500 })
    }
  }

  await prisma.character.update({
    where: { id },
    data: {
      nombre: typeof nombre === 'string' ? nombre : character.nombre,
      edad: typeof edadStr === 'string' ? parseInt(edadStr) : character.edad,
      imagen: imagePath,
    },
  })

  return NextResponse.json({ message: 'Personaje actualizado' })
}
