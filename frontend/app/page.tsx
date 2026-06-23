'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          🤖 AI Recrutement Assistant
        </h1>
        <p className="text-gray-500 text-lg">
          Analyse automatique de CV et matching intelligent avec les offres d'emploi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Card Upload */}
        <Link href="/upload">
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Upload CV
            </h2>
            <p className="text-gray-500 text-sm">
              Importe un CV en PDF et extrais automatiquement les compétences, l'email et l'expérience
            </p>
            <span className="inline-block mt-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              Parser NLP →
            </span>
          </div>
        </Link>

        {/* Card Matching */}
        <Link href="/matching">
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Matching Offres
            </h2>
            <p className="text-gray-500 text-sm">
              Poste une offre d'emploi et trouve les meilleurs candidats classés par score de pertinence
            </p>
            <span className="inline-block mt-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              Embeddings AI →
            </span>
          </div>
        </Link>
      </div>
    </main>
  )
}