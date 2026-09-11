'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Candidat {
  id: number
  email: string
  telephone: string
  skills: string[]
  nb_cvs: number
  created_at: string
}

export default function CandidatsPage() {
  const [candidats, setCandidats] = useState<Candidat[]>([])
  const [filtered, setFiltered] = useState<Candidat[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selected, setSelected] = useState<Candidat | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/cv/candidats')
      .then(res => res.json())
      .then(data => {
        setCandidats(data)
        setFiltered(data)
        setLoading(false)
      })
  }, [])

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    let result = candidats.slice()

    if (debouncedSearch) {
      result = result.filter(c =>
        c.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    if (skillFilter) {
      result = result.filter(c =>
        c.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))
      )
    }

    // sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at))
    } else if (sortBy === 'most_cvs') {
      result.sort((a, b) => b.nb_cvs - a.nb_cvs)
    }

    setFiltered(result)
  }, [debouncedSearch, skillFilter, candidats, sortBy])

  const allSkills = [...new Set(candidats.flatMap(c => c.skills))].sort()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400 text-lg">Chargement des candidats...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">👥 Candidats</h1>
            <p className="text-gray-500 text-sm">{filtered.length} candidat(s) trouvé(s)</p>
          </div>
          <Link href="/upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            + Ajouter un CV
          </Link>
        </div>

        {/* Modal détails candidat */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Détails — {selected.email}</h2>
                  <p className="text-xs text-gray-400">#{selected.id} • {new Date(selected.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">Fermer</button>
              </div>

              <div className="mt-4">
                {selected.telephone && <p className="text-sm">📞 {selected.telephone}</p>}
                <p className="text-sm mt-2">Nombre de CVs: <strong>{selected.nb_cvs}</strong></p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.skills.map(s => (
                    <button key={s} onClick={() => { setSkillFilter(s); setSelected(null) }} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">{s}</button>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigator.clipboard?.writeText(selected.email)}
                    className="text-sm bg-gray-100 px-3 py-1 rounded-md"
                  >Copier email</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Rechercher par email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Toutes les compétences</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="newest">Trier: Plus récent</option>
            <option value="oldest">Trier: Plus ancien</option>
            <option value="most_cvs">Trier: Plus de CVs</option>
          </select>
          {(search || skillFilter) && (
            <button
              onClick={() => { setSearch(''); setSkillFilter('') }}
              className="text-sm text-gray-400 hover:text-gray-600 px-3"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Liste candidats */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-400 text-lg">Aucun candidat trouvé</p>
              <Link href="/upload" className="text-blue-500 text-sm mt-2 inline-block">
                Importer un CV →
              </Link>
            </div>
          ) : (
            filtered.map((c, i) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition">
                
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {c.email[0].toUpperCase()}
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-800">{c.email}</p>
                    <span className="text-xs text-gray-400">#{c.id}</span>
                  </div>
                  {c.telephone && (
                    <p className="text-sm text-gray-500 mb-2">📞 {c.telephone}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {c.skills.slice(0, 6).map(s => (
                      <span key={s}
                        onClick={() => setSkillFilter(s)}
                        className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full cursor-pointer hover:bg-indigo-100 transition">
                        {s}
                      </span>
                    ))}
                    {c.skills.length > 6 && (
                      <span className="text-xs text-gray-400">+{c.skills.length - 6}</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    {c.nb_cvs} CV
                  </span>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(c.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => setSelected(c)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    >
                      Voir
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </main>
  )
}