interface ErrorAlertProps {
  message: string | null
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null

  return (
    <p style={{ color: 'red', fontWeight: 'bold', background: '#fadbd8', padding: '0.75rem', borderRadius: '4px' }}>
      ❌ {message}
    </p>
  )
}