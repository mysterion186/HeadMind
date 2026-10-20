interface ErrorAlertProps {
  message: string | null
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null

  return (
    <div className="bg-red-100 text-red-700 font-bold p-3 rounded-md mb-4 flex items-center gap-2">
      <span>❌</span>
      <span>{message}</span>
    </div>
  )
}
