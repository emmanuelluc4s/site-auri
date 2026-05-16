import { useParams } from 'react-router-dom'
import PagePlaceholder from '@/components/shared/PagePlaceholder'

export default function Categoria() {
  const { slug } = useParams<{ slug: string }>()
  return <PagePlaceholder pageName={`Categoria · ${slug ?? ''}`} moduleNumber={5} />
}
