'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Stats {
  total_cvs: number
  total_candidats: number
  total_offres: number
  top_skills: { skill: string; count: number }[]
  derniers_candidats: { id: number; email: string; skills: string[] }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stats')
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400 text-lg">Chargement du dashboard...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🤖 AI Recrutement</h1>
            <p className="text-gray-500 text-sm">Dashboard de recrutement</p>
          </div>
          <div className="flex gap-4">
            <Link href="/upload" className="text-sm text-gray-500 hover:text-gray-800 transition">📄 Upload CV</Link>
            <Link href="/matching" className="text-sm text-gray-500 hover:text-gray-800 transition">🎯 Matching</Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'CV analysés', value: stats!.total_cvs, icon: '📄' },
            { label: 'Candidats', value: stats!.total_candidats, icon: '👤' },
            { label: 'Offres postées', value: stats!.total_offres, icon: '💼' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <p className="text-gray-400 text-sm mb-1">{kpi.icon} {kpi.label}</p>
              <p className="text-3xl font-bold text-gray-800">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Bar chart compétences */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-4">🧠 Top compétences</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats!.top_skills} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="skill" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {stats!.top_skills.map((_, i) => (
                    <Cell key={i} fill={i < 3 ? '#6366f1' : '#a5b4fc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Derniers candidats */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-4">👥 Derniers candidats</h2>
            <div className="space-y-4">
              {stats!.derniers_candidats.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                    {c.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{c.email}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {c.skills.map(s => (
                        <span key={s} className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}