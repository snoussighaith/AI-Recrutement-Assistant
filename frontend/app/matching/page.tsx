'use client'

import { useState } from 'react'

interface Resultat {
  candidat_id: number
  email: string
  score: number
  competences: string[]
}

export default function MatchingPage() {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    competences: '',
  })
  const [resultats, setResultats] = useState<Resultat[]>([])
  const [loading, setLoading] = useState(false)

  const handleMatch = async () => {
    setLoading(true)
    const res = await fetch('http://127.0.0.1:8000/api/offres/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setResultats(data.resultats)
    setLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-700'
    if (score >= 50) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🎯 Matching Offre / Candidats
        </h1>
        <p className="text-gray-500 mb-6">
          Décris le poste et trouve les meilleurs candidats automatiquement
        </p>

        {/* Formulaire offre */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du poste
            </label>
            <input
              type="text"
              placeholder="ex: Data Engineer"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="ex: Nous cherchons un Data Engineer expérimenté..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compétences requises
            </label>
            <input
              type="text"
              placeholder="ex: Python, Kafka, Spark, Machine Learning"
              value={form.competences}
              onChange={(e) => setForm({ ...form, competences: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            onClick={handleMatch}
            disabled={!form.titre || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Analyse en cours...' : '🔍 Trouver les meilleurs candidats'}
          </button>
        </div>

        {/* Résultats */}
        {resultats.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">
              {resultats.length} candidat(s) trouvé(s)
            </h2>
            {resultats.map((r, i) => (
              <div key={r.candidat_id} className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-4">
                {/* Rang */}
                <div className="text-2xl font-bold text-gray-300 w-8">
                  #{i + 1}
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{r.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {r.competences.map((c) => (
                      <span key={c} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(r.score)}`}>
                  {r.score}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}