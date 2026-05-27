import { Link } from 'react-router-dom'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-gray-400">Settings page — coming soon.</p>
      <Link
        to="/"
        className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all"
      >
        ← Back to Timer
      </Link>
    </div>
  )
}
