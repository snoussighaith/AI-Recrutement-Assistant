'use client'

import { useState } from 'react'
import { Card, CardContent, Button, Input, TextArea, Badge } from '@/app/components'

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
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const resetSearch = () => {
    setForm({ titre: '', description: '', competences: '' })
    setResultats([])
    setSubmitted(false)
    setError('')
  }

  const handleMatch = async () => {
    if (!form.titre.trim()) {
      setError('Veuillez entrer le titre du poste')
      return
    }

    setLoading(true)
    setError('')
    setSubmitted(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/api/offres/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Erreur lors du matching')

      const data = await res.json()
      setResultats(data.resultats || [])
    } catch (err) {
      setError('Erreur: ' + (err instanceof Error ? err.message : 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-400 to-emerald-400'
    if (score >= 60) return 'bg-gradient-to-r from-yellow-400 to-amber-400'
    if (score >= 40) return 'bg-gradient-to-r from-orange-400 to-red-400'
    return 'bg-gradient-to-r from-red-400 to-pink-400'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    if (score >= 40) return 'warning'
    return 'danger'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Bon'
    if (score >= 40) return 'Acceptable'
    return 'À améliorer'
  }

  const topCandidate = resultats[0]
  const averageScore =
    resultats.length > 0
      ? Math.round(resultats.reduce((sum, candidat) => sum + candidat.score, 0) / resultats.length)
      : 0

  return (
    <main className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Smart Matching</h1>
          <p className="text-gray-600 text-lg">
            Décrivez le poste et trouvez les meilleurs candidats grâce à l'IA
          </p>
        </div>

        <Card variant="elevated" className="mb-8 border border-blue-100">
          <CardContent className="pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Créer une Offre d'Emploi</h2>
                <p className="text-gray-600 mt-1 text-sm">
                  Complétez les informations essentielles pour lancer un matching précis.
                </p>
              </div>
              <Badge variant="info" size="md">
                Étape 1: Définir le besoin
              </Badge>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <Input
                label="📋 Titre du Poste"
                placeholder="ex: Senior Data Engineer"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
              />

              <TextArea
                label="📝 Description"
                placeholder="Décrivez le poste, les responsabilités et les objectifs..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />

              <Input
                label="🧠 Compétences Requises"
                placeholder="ex: Python, Spark, Machine Learning, Cloud (séparées par des virgules)"
                value={form.competences}
                onChange={(e) => setForm({ ...form, competences: e.target.value })}
              />

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-sm font-semibold text-blue-900 mb-1">Conseil de saisie</p>
                <p className="text-sm text-blue-700">
                  Utilisez des compétences claires et séparées par des virgules pour améliorer la pertinence du scoring.
                </p>
              </div>

              <Button
                onClick={handleMatch}
                disabled={!form.titre || loading}
                isLoading={loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'Analyse en cours...' : '🔍 Lancer le Matching'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {submitted && resultats.length === 0 && !loading && (
          <Card variant="elevated" className="border-yellow-200 bg-yellow-50">
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun candidat trouvé</h3>
              <p className="text-gray-600">
                Essayez avec des compétences moins spécifiques ou vérifiez que la base de candidats n'est pas vide
              </p>
            </CardContent>
          </Card>
        )}

        {resultats.length > 0 && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📌 Résultats du Matching</h2>
              <p className="text-gray-600">
                {resultats.length} candidat{resultats.length > 1 ? 's' : ''} trouvé{resultats.length > 1 ? 's' : ''}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card variant="default">
                <CardContent className="py-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Candidats</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{resultats.length}</p>
                </CardContent>
              </Card>
              <Card variant="default">
                <CardContent className="py-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Score moyen</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{averageScore}%</p>
                </CardContent>
              </Card>
              <Card variant="default">
                <CardContent className="py-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Meilleur score</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{topCandidate.score}%</p>
                </CardContent>
              </Card>
            </div>

            <Card variant="elevated" className="border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="py-6">
                <p className="text-xs uppercase tracking-wide text-green-700 font-semibold mb-2">Top candidat</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-bold text-xl text-gray-800">{topCandidate.email}</p>
                    <p className="text-sm text-gray-600">ID: #{topCandidate.candidat_id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold text-green-700">{topCandidate.score}%</p>
                    <Badge variant="success" size="md">{getScoreLabel(topCandidate.score)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {resultats.map((candidat, index) => (
                <Card key={candidat.candidat_id} variant="elevated" className="hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{candidat.email}</p>
                          <p className="text-sm text-gray-500">ID: #{candidat.candidat_id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-800">{candidat.score}%</p>
                          <Badge variant={getScoreBadge(candidat.score)} size="sm">
                            {getScoreLabel(candidat.score)}
                          </Badge>
                        </div>
                        <div className={`w-16 h-16 rounded-full ${getScoreColor(candidat.score)} opacity-20`}></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreColor(candidat.score)} transition-all duration-500`}
                          style={{ width: `${candidat.score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2.5">
                        Compétences Correspondantes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {candidat.competences.length > 0 ? (
                          candidat.competences.map((competence) => (
                            <Badge key={competence} variant="info" size="sm">
                              ✓ {competence}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Aucune compétence correspondante</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={resetSearch}
              >
                ➕ Nouvelle Recherche
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => window.location.href = '/'}
              >
                ← Retour Accueil
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}