export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#aa3bff] rounded-full animate-spin" />
      <p className="text-gray-500 italic">Analyse des dépendances en cours avec OSV.dev...</p>
    </div>
  )
}
