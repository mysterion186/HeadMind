import { useState } from 'react'
import { type PackageInfo, type Vulnerability } from '../types'
import VulnModal from './VulnModal'

interface ResultsTableProps {
  packages: PackageInfo[]
}

export default function ResultsTable({ packages }: ResultsTableProps) {
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null)

  return (
    <>
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
          {packages.map((pkg, index) => (
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
                      <li key={vIndex} style={{ marginBottom: '0.3rem' }}>
                        <strong>{v.id}</strong>: {v.summary} {' '}
                        <button
                          onClick={() => setSelectedVuln(v)}
                          style={{ fontSize: '0.75rem', cursor: 'pointer', marginLeft: '0.5rem' }}
                        >
                          Voir plus
                        </button>
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

      <VulnModal vuln={selectedVuln} onClose={() => setSelectedVuln(null)} />
    </>
  )
}