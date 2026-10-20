export type FilterStatus = 'all' | 'vulnerable' | 'safe' | 'error'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: FilterStatus
  onFilterChange: (status: FilterStatus) => void
  severityFilter: string
  onSeverityChange: (severity: string) => void
  sortByVuln: boolean
  onToggleSort: () => void
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onFilterChange,
  severityFilter,
  onSeverityChange,
  sortByVuln,
  onToggleSort
}: SearchBarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Filtrer par nom..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-48 rounded-md border border-gray-300 p-2 text-sm text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
      />

      <select
        value={statusFilter}
        onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
        className="rounded-md border border-gray-300 p-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
      >
        <option value="all">Tous les statuts</option>
        <option value="vulnerable">⚠️ Vulnérables</option>
        <option value="safe">✅ Sûrs</option>
        <option value="error">⚠️ Erreurs</option>
      </select>

      <select
        value={severityFilter}
        onChange={(e) => onSeverityChange(e.target.value)}
        className="rounded-md border border-gray-300 p-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
      >
        <option value="all">Toutes sévérités</option>
        <option value="CRITICAL">Critical</option>
        <option value="HIGH">High</option>
        <option value="MODERATE">Moderate / Medium</option>
        <option value="LOW">Low</option>
      </select>

      <button
        type="button"
        onClick={onToggleSort}
        className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${sortByVuln
            ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-xs'
            : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
          }`}
      >
        {sortByVuln ? '🔥 Vulnérables en premier' : 'Tri par défaut'}
      </button>
    </div>
  )
}
