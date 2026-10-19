export interface Vulnerability {
  id: string
  summary: string
  details: string
}

export interface PackageInfo {
  name: string
  operator?: string
  version: string
  raw: string
  vulnerable: boolean
  error: boolean
  error_message: string
  vulns: Vulnerability[]
}

export interface ScanResult {
  filename: string
  count: number
  packages: PackageInfo[]
}