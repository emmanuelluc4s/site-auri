import { Select, type SelectOption } from '@/components/ui/select'
import type { SortOption } from '@/types'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const SORT_OPTIONS: ReadonlyArray<SelectOption<SortOption>> = [
  { value: 'newest',     label: 'Mais recentes' },
  { value: 'price_asc',  label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'popular',    label: 'Mais populares' },
]

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select<SortOption>
      value={value}
      options={SORT_OPTIONS}
      onChange={onChange}
      ariaLabel="Ordenar por"
    />
  )
}
