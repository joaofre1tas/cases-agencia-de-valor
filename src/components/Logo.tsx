import { cn } from '@/lib/utils'

type LogoVariant = 'full' | 'circle' | 'symbol'

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant
}

const LOGO_SRC: Record<LogoVariant, string> = {
  full: '/brand/av-logo-full.svg',
  circle: '/brand/av-logo-circle.svg',
  symbol: '/brand/av-symbol.svg',
}

export function Logo({ variant = 'full', className, alt, ...props }: LogoProps) {
  return (
    <img
      src={LOGO_SRC[variant]}
      alt={alt ?? 'Agência de Valor'}
      className={cn('block h-auto w-auto select-none', className)}
      draggable={false}
      {...props}
    />
  )
}
