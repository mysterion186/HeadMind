import { useState } from 'react'
import { type ScanResult } from './types'
import { uploadRequirementsFile } from './services/api'
import FileUpload from './components/FileUpload'
import SearchBar, { type FilterStatus } from './components/SearchBar'
import ResultsTable from './components/ResultsTable'
import ErrorAlert from './components/ErrorAlert'
import Spinner from './components/Spinner'

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [sortByVuln, setSortByVuln] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Veuillez sélectionner un fichier requirements.txt.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await uploadRequirementsFile(file)
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du scan.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = (result?.packages || []).filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (!matchesSearch) return false

    if (statusFilter === 'vulnerable' && !pkg.vulnerable) return false
    if (statusFilter === 'safe' && (pkg.vulnerable || pkg.error)) return false
    if (statusFilter === 'error' && !pkg.error) return false

    // Filtre par sévérité si demandé
    if (severityFilter !== 'all') {
      const hasMatchingSeverity = pkg.vulns.some(v => v.severity?.includes(severityFilter))
      if (!hasMatchingSeverity) return false
    }

    return true
  })
  const processedPackages = [...filteredPackages].sort((a, b) => {
    if (!sortByVuln) return 0
    if (a.vulnerable && !b.vulnerable) return -1
    if (!a.vulnerable && b.vulnerable) return 1
    return 0
  })

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Scanner de Vulnérabilités (requirements.txt)</h1>

      <FileUpload
        onFileSelect={setFile}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <ErrorAlert message={error} />

      {loading && <Spinner />}

      {result && !loading && (
        <div>
          <h3>Résultats pour : {result.filename} ({filteredPackages.length || filteredPackages.length} packages affichés)</h3>

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
            severityFilter={severityFilter}
            onSeverityChange={setSeverityFilter}
            sortByVuln={sortByVuln}
            onToggleSort={() => setSortByVuln(!sortByVuln)}
          />

          <ResultsTable packages={processedPackages} />
        </div>
      )}
    </div>
  )
}
