import { useState } from 'react'

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackBg?: string
}

export function ImageWithFallback({ src, alt, fallbackBg = '#E4E9F0', className, style, ...props }: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={className}
        style={{ backgroundColor: fallbackBg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
        aria-label={alt}
        role="img"
      >
        <span style={{ color: '#667085', fontSize: 12 }}>Image</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setError(true)}
      {...props}
    />
  )
}
