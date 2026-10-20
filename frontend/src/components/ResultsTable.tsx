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
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-4">
        <table className="w-full text-left text-sm text-gray-700 border-collapse">
          <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Statut Sécurité</th>
              <th className="px-4 py-3">Détails / Erreurs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {packages.map((pkg, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">{pkg.name}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{pkg.raw}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {pkg.error ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white shadow-xs">
                      ⚠️ Erreur d'analyse
                    </span>
                  ) : pkg.vulnerable ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white shadow-xs">
                      ⚠️ Vulnérable ({pkg.vulns.length})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white shadow-xs">
                      ✅ Sûr
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {pkg.error ? (
                    <span className="text-amber-700 text-xs italic">
                      {pkg.error_message}
                    </span>
                  ) : pkg.vulnerable ? (
                    <ul className="list-disc pl-4 space-y-1 text-xs">
                      {pkg.vulns.map((v, vIndex) => (
                        <li key={vIndex} className="text-gray-800">
                          <span className="font-semibold text-red-700">{v.id}</span>: {v.summary}{' '}
                          <button
                            type="button"
                            onClick={() => setSelectedVuln(v)}
                            className="ml-2 text-xs text-purple-600 hover:text-purple-800 underline font-medium cursor-pointer transition-colors"
                          >
                            Voir plus
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 text-xs italic">
                      Aucune vulnérabilité détectée
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VulnModal vuln={selectedVuln} onClose={() => setSelectedVuln(null)} />
    </>
  )
}
