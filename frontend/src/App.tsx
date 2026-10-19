import { useState } from 'react'

interface PackageInfo {
  name: string
  version: string
  raw: string
}

interface ScanResult {
  filename: string
  count: number
  packages: PackageInfo[]
}

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Veuillez sélectionner un fichier.')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`)
      }

      const data: ScanResult = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Scanner de requirements.txt</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Analyse...' : 'Scanner'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {result && (
        <div>
          <h3>Résultats pour : {result.filename} ({result.count} packages trouvés)</h3>
          <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f4f4' }}>
                <th>Package</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {result.packages.map((pkg, index) => (
                <tr key={index}>
                  <td><strong>{pkg.name}</strong></td>
                  <td>{pkg.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}