import { Select, type SelectOption } from '@/components/ui/select'

interface SortDropdownProps<T extends string> {
  value: T
  onChange: (value: T) => void
  // Opções extras (ex: "Maior desconto" só na página de Promoções).
  // Ficam no topo da lista, antes das padrão.
  extraOptions?: ReadonlyArray<SelectOption<T>>
}

const DEFAULT_OPTIONS = [
  { value: 'newest',     label: 'Mais recentes' },
  { value: 'price_asc',  label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'popular',    label: 'Mais populares' },
] as const

export default function SortDropdown<T extends string = string>({
  value,
  onChange,
  extraOptions = [],
}: SortDropdownProps<T>) {
  const options: ReadonlyArray<SelectOption<T>> = [
    ...extraOptions,
    ...(DEFAULT_OPTIONS as unknown as ReadonlyArray<SelectOption<T>>),
  ]

  return (
    <Select<T>
      value={value}
      options={options}
      onChange={onChange}
      ariaLabel="Ordenar por"
    />
  )
}
