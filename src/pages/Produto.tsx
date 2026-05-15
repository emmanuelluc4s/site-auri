import { useParams } from 'react-router-dom'

export default function Produto() {
  const { slug } = useParams<{ slug: string }>()
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted-foreground">
        Produto <span className="font-mono">/{slug}</span> — em desenvolvimento (Módulo 6)
      </p>
    </div>
  )
}
