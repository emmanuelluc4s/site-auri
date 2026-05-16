import { useParams } from 'react-router-dom'
import PagePlaceholder from '@/components/shared/PagePlaceholder'

export default function Produto() {
  const { slug } = useParams<{ slug: string }>()
  return <PagePlaceholder pageName={`Produto · ${slug ?? ''}`} moduleNumber={6} />
}
