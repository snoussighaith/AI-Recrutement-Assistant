'use client'

import { useState } from 'react'
import { Card, CardContent, Button, Input, Badge } from '@/app/components'

interface CvData {
  email?: string
  phone?: string
  skills: string[]
}

interface UploadResult {
  message?: string
  data: CvData
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('http://127.0.0.1:8000/api/cv/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Erreur lors de l\'analyse')

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError('Erreur: ' + (err instanceof Error ? err.message : 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setResult(null)
    setError('')
  }

  const sortedSkills = (result?.data.skills || []).slice().sort((a, b) => a.localeCompare(b, 'fr'))

  return (
    <main className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Parser CV Intelligent</h1>
          <p className="text-gray-600 text-lg">
            Importez un CV en PDF et notre IA extraira automatiquement les compétences et informations
          </p>
        </div>

        <Card variant="elevated" className="mb-8 border border-blue-100">
          <CardContent className="pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Importer un CV</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Format accepté: PDF uniquement. Taille recommandée: moins de 5 MB.
                </p>
              </div>
              <Badge variant="info" size="md">
                Étape 1: Upload
              </Badge>
            </div>

            <label className="block mb-6">
              <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">☁️</div>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    {file ? '✓ Fichier sélectionné' : 'Déposer un fichier PDF'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {file ? file.name : 'ou cliquez pour parcourir'}
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const newFile = e.target.files?.[0]
                    if (newFile) {
                      setFile(newFile)
                      setResult(null)
                      setError('')
                    }
                  }}
                />
              </div>
            </label>

            {file && (
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Fichier sélectionné</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Nom:</span> {file.name}
                  </p>
                  <p>
                    <span className="font-semibold">Taille:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              isLoading={loading}
              size="lg"
              className="w-full mb-4"
            >
              {loading ? 'Analyse en cours...' : '🔍 Analyser le CV'}
            </Button>

            {file && (
              <Button
                onClick={resetForm}
                variant="secondary"
                size="md"
                className="w-full"
              >
                Changer de fichier
              </Button>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card variant="elevated" className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">✅</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Analyse Complétée</h2>
                  <p className="text-sm text-gray-600 mt-1">Résultats organisés par sections.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Compétences</p>
                  <p className="text-2xl font-bold text-gray-800">{result.data.skills.length}</p>
                </div>
                {result.data.email && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</p>
                    <p className="text-base font-semibold text-gray-800 break-all">{result.data.email}</p>
                  </div>
                )}
                {result.data.phone && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Téléphone</p>
                    <p className="text-base font-semibold text-gray-800">{result.data.phone}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🧠 Compétences Détectées ({result.data.skills.length})
                </h3>
                {sortedSkills.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {sortedSkills.map((skill) => (
                      <Badge key={skill} variant="primary" size="md" className="text-center justify-center w-full py-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Aucune compétence détectée dans ce CV.</p>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t border-green-200">
                <Button variant="primary" className="flex-1" onClick={() => window.location.href = '/matching'}>
                  🎯 Trouver des Offres
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => window.location.href = '/'}>
                  ← Retour
                </Button>
              </div>

              <div className="mt-3">
                <Button variant="ghost" className="w-full" onClick={resetForm}>
                  Réinitialiser l'analyse
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}