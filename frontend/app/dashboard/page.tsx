'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import { Card, CardContent, Button, KPICard, Badge } from '@/app/components'

interface Stats {
  total_cvs: number
  total_candidats: number
  total_offres: number
  top_skills: { skill: string; count: number }[]
  derniers_candidats: { id: number; email: string; skills: string[] }[]
}

const chartColors = ['#2563eb', '#7c3aed', '#db2777', '#0891b2', '#059669', '#d97706']

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-8 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-gray-500 text-lg font-medium">Chargement du dashboard...</p>
        </div>
      </main>
    )
  }

  if (!stats) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-8 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 text-lg">Erreur lors du chargement des données</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-2">📊 Dashboard</h1>
              <p className="text-gray-600 text-lg">Vue d'ensemble de votre activité de recrutement</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/upload">
                <Button variant="outline" size="md">📄 Upload CV</Button>
              </Link>
              <Link href="/matching">
                <Button variant="primary" size="md">🎯 Matching</Button>
              </Link>
            </div>
          </div>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard 
              icon="📄"
              label="CV Analysés"
              value={stats.total_cvs}
              trend={{ value: 12, direction: 'up' }}
            />
            <KPICard 
              icon="👤"
              label="Candidats"
              value={stats.total_candidats}
              trend={{ value: 8, direction: 'up' }}
            />
            <KPICard 
              icon="💼"
              label="Offres Postées"
              value={stats.total_offres}
              trend={{ value: 5, direction: 'down' }}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Skills Chart */}
          <Card variant="elevated">
            <CardContent className="pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  🧠 Top Compétences
                </h2>
                <Badge variant="info">Top {stats.top_skills.length}</Badge>
              </div>

              {stats.top_skills.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={stats.top_skills}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="skill" width={95} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                      cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#2563eb">
                      {stats.top_skills.map((_, i) => (
                        <Cell key={i} fill={chartColors[i % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Pas de compétences enregistrées
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card variant="elevated">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📈 Tendance d'Activité
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { month: 'Semaine 1', cvs: 15, offres: 3 },
                    { month: 'Semaine 2', cvs: 22, offres: 5 },
                    { month: 'Semaine 3', cvs: 18, offres: 4 },
                    { month: 'Semaine 4', cvs: 28, offres: 6 },
                  ]}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="cvs" stroke="#2563eb" strokeWidth={2} name="CVs analysés" />
                  <Line type="monotone" dataKey="offres" stroke="#7c3aed" strokeWidth={2} name="Offres postées" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Candidates */}
        <Card variant="elevated">
          <CardContent className="pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                👥 Derniers Candidats
              </h2>
              <Badge variant="neutral">{stats.derniers_candidats.length} candidats</Badge>
            </div>

            {stats.derniers_candidats.length > 0 ? (
              <div className="space-y-3">
                {stats.derniers_candidats.map((candidat, i) => (
                  <div
                    key={candidat.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow border border-blue-100/50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{candidat.email}</p>
                        <p className="text-xs text-gray-500 mt-0.5">ID: #{candidat.id}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      {candidat.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="primary" size="sm">
                          {skill}
                        </Badge>
                      ))}
                      {candidat.skills.length > 3 && (
                        <Badge variant="neutral" size="sm">
                          +{candidat.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400">
                Aucun candidat enregistré
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="text-center py-8">
              <div className="text-5xl mb-4">📤</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Importer des CVs</h3>
              <p className="text-gray-600 mb-4">Commencez à analyser des candidatures</p>
              <Link href="/upload" className="inline-block">
                <Button variant="primary">Importer Maintenant</Button>
              </Link>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="text-center py-8">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Trouver des Candidats</h3>
              <p className="text-gray-600 mb-4">Lancez un nouveau matching intelligent</p>
              <Link href="/matching" className="inline-block">
                <Button variant="primary">Matcher Maintenant</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}