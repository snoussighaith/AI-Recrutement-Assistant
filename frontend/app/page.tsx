'use client'

import Link from 'next/link'
import { Card, CardContent, Button } from './components'

interface Feature {
  href: string
  icon: string
  title: string
  description: string
  badge: string
  badgeColor: string
}

const features: Feature[] = [
  {
    href: '/dashboard',
    icon: '📊',
    title: 'Dashboard',
    description: 'Statistiques détaillées, KPIs et visualisations interactives de recrutement',
    badge: 'Stats & Analytics',
    badgeColor: 'from-purple-500 to-pink-500',
  },
  {
    href: '/upload',
    icon: '📄',
    title: 'Parser CV',
    description: 'Import automatique de CV et extraction intelligente des compétences',
    badge: 'NLP Technology',
    badgeColor: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/matching',
    icon: '🎯',
    title: 'Smart Matching',
    description: 'Trouve les meilleurs candidats classés par score de pertinence avec IA',
    badge: 'AI Powered',
    badgeColor: 'from-green-500 to-emerald-500',
  },
  {
    href: '/candidats',
    icon: '👥',
    title: 'Candidats',
    description: 'Liste complète des candidats avec filtres par compétences et recherche',
    badge: 'Gestion RH',
    badgeColor: 'from-orange-500 to-amber-500',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <div className="mb-6 inline-block">
          <div className="text-7xl mb-4 drop-shadow-lg">🤖</div>
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-sm font-semibold text-blue-700 border border-blue-200">
            ✨ Recrutement Intelligent
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI Recrutement Assistant
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transformez votre processus de recrutement avec l'intelligence artificielle. 
          Analysez les CV, trouvez les meilleurs candidats et optimisez vos décisions d'embauche.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            variant="primary"
            className="text-lg"
            onClick={() => window.location.href = '/matching'}
          >
            🚀 Commencer le Matching
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg"
            onClick={() => window.location.href = '/upload'}
          >
            📤 Importer un CV
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { label: 'Analyses', value: '1000+' },
            { label: 'Candidats', value: '500+' },
            { label: 'Offres', value: '100+' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/50 backdrop-blur rounded-xl p-4 border border-gray-200/50">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Fonctionnalités Principales</h2>
          <p className="text-gray-600 text-lg">Outils puissants pour optimiser votre recrutement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="group">
              <Card variant="elevated" className="h-full">
                <CardContent className="pt-8">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${feature.badgeColor} shadow-lg shadow-blue-500/30`}>
                    {feature.badge} →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Prêt à révolutionner votre recrutement ?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Commencez par télécharger un CV ou consultez votre dashboard
            </p>
            <Button size="lg" variant="primary" onClick={() => window.location.href = '/upload'}>
              Débuter Maintenant 🎯
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}