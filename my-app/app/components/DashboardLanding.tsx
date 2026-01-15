import React from 'react'
import Link from 'next/link'

export default function DashboardLanding() {
  const mediaSections = [
    { name: 'Movies', href: '/video-movies' },
    { name: 'Series', href: '/series' },
    { name: 'Anime', href: '/anime' },
    { name: 'Manga', href: '/manga' },
  ];
  const quickActions = [
    { id: 'categories', title: 'Categories', subtitle: 'Manage categories', href: '/dashboard/categories' },
    { id: 'videos', title: 'Videos & Movies', subtitle: 'Browse content', href: '/dashboard/video-movies' },
  ]

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Overview of activity and quick links to manage your content.
          </p>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Videos</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">128</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Categories</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">12</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">3,214</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Storage Used</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">42 GB</div>
          </div>
        </section>

        {/* Media Sections */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {mediaSections.map((section) => (
              <div key={section.name} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400">{section.name}</div>
                <a href={section.href} className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Click here
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((a) => (
              <Link key={a.id} href={a.href} className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="text-sm text-gray-500 dark:text-gray-400">{a.title}</div>
                <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{a.subtitle}</div>
              </Link>
            ))}
          </div>
        </section>
        {/* Recent activity / placeholder */}
        <section>
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Recent activity</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              <li className="py-3">
                <div className="text-sm text-gray-700 dark:text-gray-200">New video "Intro to Tailwind" uploaded</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
              </li>
              <li className="py-3">
                <div className="text-sm text-gray-700 dark:text-gray-200">Category "Documentaries" created</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Yesterday</div>
              </li>
              <li className="py-3 text-sm text-gray-500 dark:text-gray-400">No more activity — this is a placeholder list.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}