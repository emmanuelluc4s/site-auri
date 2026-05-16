import {
  Glasses,
  Headphones,
  type LucideIcon,
  Package,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Watch,
} from 'lucide-react'

// Mapa explícito de nomes (do banco) → ícones Lucide.
// Tree-shaking funciona porque cada ícone é importado por nome.
// Para adicionar mais ícones, basta importar acima e registrar aqui.
const ICON_MAP: Record<string, LucideIcon> = {
  glasses: Glasses,
  headphones: Headphones,
  package: Package,
  shirt: Shirt,
  shopping_bag: ShoppingBag,
  shoppingbag: ShoppingBag,
  smartphone: Smartphone,
  sparkles: Sparkles,
  watch: Watch,
}

// Resolve um nome de ícone (gravado no banco) para o componente Lucide.
// Cai para `Package` se o ícone não estiver no mapa.
export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Package
  const key = name.toLowerCase().replace(/[-\s]/g, '_')
  return ICON_MAP[key] ?? Package
}
