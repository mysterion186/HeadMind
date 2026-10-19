import { type Vulnerability } from '../types'

interface VulnModalProps {
  vuln: Vulnerability | null
  onClose: () => void
}

export default function VulnModal({ vuln, onClose }: VulnModalProps) {
  if (!vuln) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
        <h3>Détails de la vulnérabilité : {vuln.id}</h3>
        <p><strong>Résumé :</strong> {vuln.summary}</p>
        <p><strong>Description :</strong> {vuln.details || "Aucun détail supplémentaire disponible."}</p>
        <p>
          <strong>Source :</strong>{' '}
          <a
            href={`https://osv.dev/vulnerability/${vuln.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir sur OSV.dev ({vuln.id})
          </a>
        </p>
        <button onClick={onClose} style={{ marginTop: '1rem', padding: '0.4rem 1rem', cursor: 'pointer' }}>
          Fermer
        </button>
      </div>
    </div>
  )
}