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
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Filtrer par nom..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ padding: '0.5rem', width: '180px' }}
      />

      <select
        value={statusFilter}
        onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
        style={{ padding: '0.5rem' }}
      >
        <option value="all">Tous les statuts</option>
        <option value="vulnerable">⚠️ Vulnérables</option>
        <option value="safe">✅ Sûrs</option>
        <option value="error">⚠️ Erreurs</option>
      </select>

      {/* Nouveau filtre par Sévérité */}
      <select
        value={severityFilter}
        onChange={(e) => onSeverityChange(e.target.value)}
        style={{ padding: '0.5rem' }}
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
        style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: sortByVuln ? '#e74c3c' : '#f4f4f4', color: sortByVuln ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        {sortByVuln ? '🔥 Vulnérables en premier' : 'Tri par défaut'}
      </button>
    </div>
  )
}