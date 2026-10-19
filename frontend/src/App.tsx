import { useState } from 'react'

interface Vulnerability {
  id: string
  summary: string
  details: string
}

interface PackageInfo {
  name: string
  operator?: string
  version: string
  raw: string
  vulnerable: boolean
  error: boolean
  error_message: string
  vulns: Vulnerability[]
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
      setError('Veuillez sélectionner un fichier requirements.txt.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Erreur serveur (Code ${response.status})`)
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du scan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Scanner de Vulnérabilités (requirements.txt)</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.5rem 1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Analyse en cours (OSV.dev)...' : 'Scanner le fichier'}
        </button>
      </form>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>❌ {error}</p>}

      {result && (
        <div>
          <h3>Résultats pour : {result.filename} ({result.count} packages analysés)</h3>

          <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                <th>Package</th>
                <th>Version</th>
                <th>Statut Sécurité</th>
                <th>Détails / Erreurs</th>
              </tr>
            </thead>
            <tbody>
              {result.packages.map((pkg, index) => (
                <tr key={index}>
                  <td><strong>{pkg.name}</strong></td>
                  <td>{pkg.raw}</td>
                  <td>
                    {pkg.error ? (
                      <span style={{ color: 'white', background: '#f39c12', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        ⚠️ Erreur d'analyse
                      </span>
                    ) : pkg.vulnerable ? (
                      <span style={{ color: 'white', background: '#e74c3c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        ⚠️ Vulnérable ({pkg.vulns.length})
                      </span>
                    ) : (
                      <span style={{ color: 'white', background: '#2ecc71', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        ✅ Sûr
                      </span>
                    )}
                  </td>
                  <td>
                    {pkg.error ? (
                      <span style={{ color: '#d35400', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        {pkg.error_message}
                      </span>
                    ) : pkg.vulnerable ? (
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                        {pkg.vulns.map((v, vIndex) => (
                          <li key={vIndex}>
                            <strong>{v.id}</strong>: {v.summary}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Aucune vulnérabilité détectée</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}