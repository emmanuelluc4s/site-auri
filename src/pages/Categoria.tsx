import { useParams } from 'react-router-dom'

export default function Categoria() {
  const { slug } = useParams<{ slug: string }>()
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted-foreground">
        Categoria <span className="font-mono">/{slug}</span> — em desenvolvimento (Módulo 5)
      </p>
    </div>
  )
}
