import { type ScanResult } from '../types'

const API_URL = 'http://localhost:8000/api/upload/'

export async function uploadRequirementsFile(file: File): Promise<ScanResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `Erreur serveur (Code ${response.status})`)
  }

  return data
}