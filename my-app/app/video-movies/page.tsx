"use client"

import React, { useMemo, useState } from 'react'
import Link from 'next/link'

type Movie = {
  id: string
  title: string
  year: number
  duration: string
  rating: number
  genre: string
  thumbnail?: string
}

const SAMPLE_MOVIES: Movie[] = [
  { id: 'm1', title: 'The Long Journey', year: 2023, duration: '1h 42m', rating: 8.2, genre: 'Drama' },
  { id: 'm2', title: 'Skyline Chase', year: 2021, duration: '2h 4m', rating: 7.4, genre: 'Action' },
  { id: 'm3', title: 'Animated Tales', year: 2020, duration: '1h 18m', rating: 8.7, genre: 'Animation' },
  { id: 'm4', title: 'Mystery of Echoes', year: 2024, duration: '1h 55m', rating: 7.9, genre: 'Thriller' },
  { id: 'm5', title: 'Retro Romance', year: 2019, duration: '1h 36m', rating: 6.8, genre: 'Romance' },
  { id: 'm6', title: 'Space Between', year: 2022, duration: '2h 10m', rating: 8.5, genre: 'Sci-Fi' },
]

export default function MoviesPage() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('All')

  const genres = useMemo(() => ['All', ...Array.from(new Set(SAMPLE_MOVIES.map((m) => m.genre)))], [])

  const filtered = useMemo(() => {
    return SAMPLE_MOVIES.filter((m) => {
      const matchesQuery = query.trim() === '' || m.title.toLowerCase().includes(query.toLowerCase())
      const matchesGenre = genre === 'All' || m.genre === genre
      return matchesQuery && matchesGenre
    })
  }, [query, genre])

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Movies & Videos</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Browse and manage your video library.</p>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 flex items-center gap-3">
            <label className="sr-only" htmlFor="search">Search movies</label>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, year..."
              className="w-full sm:w-72 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <section>
          {filtered.length === 0 ? (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center">
              <p className="text-gray-600 dark:text-gray-300">No movies found. Try a different search or add a new movie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((m) => (
                <article key={m.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  {/* Thumbnail */}
                  <div className="h-40 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-end px-3 pb-3">
                    <div className="bg-black/40 text-white text-xs px-2 py-1 rounded">{m.year}</div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{m.title}</h3>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>{m.duration}</span>
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 12.146l3.717 2.196-.997-4.095L14 7.382l-4.183-.363L8 3 6.183 7.019 2 7.382l3.28 2.865-.996 4.095L8 12.146z" />
                        </svg>
                        <span>{m.rating}</span>
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <Link href={`/dashboard/video-movies/${m.id}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        View
                      </Link>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/video-movies/${m.id}/edit`} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer / pagination placeholder */}
        <footer className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>{filtered.length} result(s)</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">Prev</button>
            <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">Next</button>
          </div>
        </footer>
      </div>
    </main>
  )
}