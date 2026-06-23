'use client'

import { useState } from 'react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('http://127.0.0.1:8000/api/cv/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          📄 Upload CV
        </h1>
        <p className="text-gray-500 mb-6">
          Importe un CV en PDF pour extraire les informations automatiquement
        </p>

        {/* Zone upload */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition">
          <span className="text-4xl mb-2">☁️</span>
          <span className="text-gray-500 text-sm">
            {file ? file.name : 'Clique pour choisir un PDF'}
          </span>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {/* Bouton */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Analyse en cours...' : 'Analyser le CV'}
        </button>

        {/* Résultat */}
        {result && (
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h2 className="font-semibold text-gray-700 mb-3">
              ✅ Résultat
            </h2>
            <p><span className="font-medium">Email :</span> {result.data.email || 'Non trouvé'}</p>
            <p><span className="font-medium">Téléphone :</span> {result.data.phone || 'Non trouvé'}</p>
            <div className="mt-2">
              <span className="font-medium">Compétences :</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.data.skills.map((skill: string) => (
                  <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}