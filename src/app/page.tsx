'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Waifu = {
  id: number
  nombre: string
  edad: number
  imagen: string
}

export default function HomePage() {
  const [waifus, setWaifus] = useState<Waifu[]>([])
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    imagen: null as File | null,
  })

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editWaifu, setEditWaifu] = useState<Waifu | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formPreviewImage, setFormPreviewImage] = useState<string | null>(null)

  const [editForm, setEditForm] = useState({
    nombre: '',
    edad: '',
    imagen: null as File | null,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch waifus from API
  const fetchWaifus = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Error cargando waifus')
      const data = await res.json()
      setWaifus(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // On mount fetch waifus
  useEffect(() => {
    fetchWaifus()
  }, [])

  // Preview image for new waifu form
  useEffect(() => {
    if (form.imagen) {
      const url = URL.createObjectURL(form.imagen)
      setFormPreviewImage(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setFormPreviewImage(null)
    }
  }, [form.imagen])

  // Preview image for edit form
  useEffect(() => {
    if (editForm.imagen) {
      const url = URL.createObjectURL(editForm.imagen)
      setPreviewImage(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewImage(null)
    }
  }, [editForm.imagen])

  // Handle submit for new waifu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fd = new FormData()
    fd.append('nombre', form.nombre)
    fd.append('edad', form.edad)
    if (form.imagen) fd.append('imagen', form.imagen)

    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error('Error creando personaje')

      setForm({ nombre: '', edad: '', imagen: null })
      fetchWaifus()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Handle delete waifu
  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro quieres eliminar este personaje?')) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/characters/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error eliminando pweaonJW')
      fetchWaifus()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Open modal for editing
  const openEditModal = (waifu: Waifu) => {
    setEditWaifu(waifu)
    setEditForm({
      nombre: waifu.nombre,
      edad: waifu.edad.toString(),
      imagen: null,
    })
    setEditModalOpen(true)
  }

  // Close edit modal
  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditWaifu(null)
    setPreviewImage(null)
  }

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editWaifu) return
    setLoading(true)
    setError(null)

    const fd = new FormData()
    fd.append('id', editWaifu.id.toString())
    fd.append('nombre', editForm.nombre)
    fd.append('edad', editForm.edad)
    if (editForm.imagen) fd.append('imagen', editForm.imagen)

    try {
      const res = await fetch('/api/characters', { method: 'PUT', body: fd })
      if (!res.ok) throw new Error('Error actualizando waifu')
      closeEditModal()
      fetchWaifus()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-darkBlack p-8 font-poppins text-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-5xl font-display text-haruPurple mb-12"
      >
        Personajes
      </motion.h1>

      {error && (
        <div className="mb-6 rounded bg-red-600 bg-opacity-80 p-3 font-semibold text-red-200 shadow-lg">
          {error}
        </div>
      )}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mx-auto mb-12 max-w-3xl bg-darkBlack border border-haruPurple rounded-lg p-8 shadow-[0_0_30px_#8B1E3F90] backdrop-blur-md"
      >
        <fieldset disabled={loading} className="grid gap-6 md:grid-cols-2 text-creamWhite">
          <label className="flex flex-col text-left">
            Nombre
            <input
              required
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="mt-1 rounded bg-[#1c1b22] border border-haruPurple p-3 text-creamWhite placeholder-creamWhite/40 focus:outline-none focus:ring-2 focus:ring-haruPurple"
              placeholder="Ej: Haru Okumura"
            />
          </label>
          <label className="flex flex-col text-left">
            Edad
            <input
              required
              type="text"
              name="edad"
              value={form.edad}
              onChange={e => setForm({ ...form, edad: e.target.value })}
              className="mt-1 rounded bg-[#1c1b22] border border-haruPurple p-3 text-creamWhite placeholder-creamWhite/40 focus:outline-none focus:ring-2 focus:ring-haruPurple"
              placeholder="Ej: 55"
            />
          </label>
          <label className="md:col-span-2 flex flex-col text-left">
            Imagen
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={e => setForm({ ...form, imagen: e.target.files?.[0] || null })}
              className="mt-1 cursor-pointer rounded bg-[#1c1b22] border border-haruPurple p-2 text-creamWhite file:bg-haruPurple file:text-darkBlack file:font-bold file:rounded file:px-4 file:py-1"
            />
          </label>
        </fieldset>

        {formPreviewImage && (
          <img
            src={formPreviewImage}
            alt="Preview de la imagen"
            className="mt-2 h-48 w-full rounded-lg object-cover border-2 border-haruPurple shadow-lg"
          />
        )}

        <button
          disabled={loading}
          type="submit"
          className="mt-8 w-full bg-haruPurple text-darkBlack font-bold tracking-wide uppercase py-3 rounded-lg shadow-[0_0_15px_#8B1E3F] hover:bg-personaRed hover:text-creamWhite transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Agregando...' : 'Agregar Personaje'}
        </button>
      </form>

      {/* Lista de waifus */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {waifus.map(w => (
          <motion.article
            key={w.id}
            className="bg-darkBlack border border-haruPurple rounded-lg p-6 shadow-[0_0_30px_#8B1E3F90] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={w.imagen}
              alt={w.nombre}
              onError={e => (e.target as HTMLImageElement).src = '/placeholder.jpg'}
              className="mb-4 h-48 w-full rounded object-cover border border-haruPurple shadow-md"
              loading="lazy"
            />
            <h2 className="text-xl font-semibold text-haruPurple">{w.nombre}</h2>
            <p className="text-sm text-creamWhite/70">Edad: {w.edad}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => openEditModal(w)}
                className="flex-grow rounded bg-haruPurple py-2 text-darkBlack font-bold transition-colors hover:bg-personaRed hover:text-creamWhite focus:outline-none focus:ring-2 focus:ring-haruPurple"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(w.id)}
                className="flex-grow rounded bg-red-700 py-2 text-white font-bold transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </motion.article>
        ))}
      </section>

      {/* Modal */}
      {editModalOpen && editWaifu && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          onClick={e => {
            if (e.target === e.currentTarget) closeEditModal()
          }}
        >
          <form
            onSubmit={handleEditSubmit}
            encType="multipart/form-data"
            className="max-h-[90vh] w-full max-w-3xl overflow-auto bg-darkBlack border border-haruPurple rounded-lg p-8 shadow-[0_0_30px_#8B1E3F90] backdrop-blur-md"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="mb-6 text-3xl font-extrabold tracking-wide text-haruPurple">
              Editar Personaje
            </h2>

            <fieldset disabled={loading} className="grid gap-4 md:grid-cols-2 text-creamWhite">
              <label className="flex flex-col">
                Nombre
                <input
                  required
                  type="text"
                  name="nombre"
                  value={editForm.nombre}
                  onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                  className="mt-1 rounded bg-[#1c1b22] border border-haruPurple p-3 text-creamWhite placeholder-creamWhite/40 focus:outline-none focus:ring-2 focus:ring-haruPurple"
                />
              </label>
              <label className="flex flex-col">
                Edad
                <input
                  required
                  type="text"
                  name="edad"
                  value={editForm.edad}
                  onChange={e => setEditForm({ ...editForm, edad: e.target.value })}
                  className="mt-1 rounded bg-[#1c1b22] border border-haruPurple p-3 text-creamWhite placeholder-creamWhite/40 focus:outline-none focus:ring-2 focus:ring-haruPurple"
                />
              </label>
              <label className="flex flex-col">
                Imagen
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={e =>
                    setEditForm({ ...editForm, imagen: e.target.files?.[0] || null })
                  }
                  className="mt-1 cursor-pointer rounded bg-[#1c1b22] border border-haruPurple p-2 text-creamWhite file:bg-haruPurple file:text-darkBlack file:font-bold file:rounded file:px-4 file:py-1"
                />
              </label>
            </fieldset>

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview de la imagen"
                className="mt-2 h-48 w-full rounded-lg border-2 border-haruPurple shadow-lg bg-darkBlack"
              />
            )}

            <div className="mt-6 flex gap-4">
              <button
                disabled={loading}
                type="submit"
                className="flex-grow rounded bg-haruPurple py-3 font-bold uppercase tracking-wide text-darkBlack transition-colors hover:bg-personaRed hover:text-creamWhite disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="flex-grow rounded border border-haruPurple bg-darkBlack py-3 font-bold uppercase tracking-wide text-haruPurple hover:bg-[#2a2335]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </dialog>
      )}
    </main>
  )
}
