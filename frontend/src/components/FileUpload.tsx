import React from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

export default function FileUpload({ onFileSelect, onSubmit, loading }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: '0.5rem 1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Analyse en cours (OSV.dev)...' : 'Scanner le fichier'}
      </button>
    </form>
  )
}