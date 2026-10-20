import { type Vulnerability } from '../types'

interface VulnModalProps {
  vuln: Vulnerability | null
  onClose: () => void
}

export default function VulnModal({ vuln, onClose }: VulnModalProps) {
  if (!vuln) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transition-all">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          Détails de la vulnérabilité : <span className="text-red-600">{vuln.id}</span>
        </h3>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong className="font-semibold text-gray-900">Résumé :</strong> {vuln.summary}
          </p>
          <p className="max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600 border border-gray-200">
            <strong className="font-semibold text-gray-900 block mb-1">Description :</strong>
            {vuln.details || "Aucun détail supplémentaire disponible."}
          </p>
          <p>
            <strong className="font-semibold text-gray-900">Source :</strong>{' '}
            <a
              href={`https://osv.dev/vulnerability/${vuln.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-600 underline hover:text-purple-800 transition-colors"
            >
              Voir sur OSV.dev ({vuln.id})
            </a>
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
