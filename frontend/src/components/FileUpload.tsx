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
    <form onSubmit={onSubmit} className="mb-8 flex gap-4 items-center flex-wrap">
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${loading
            ? 'bg-purple-300 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
          }`}
      >
        {loading ? 'Analyse en cours (OSV.dev)...' : 'Scanner le fichier'}
      </button>
    </form>
  )
}
