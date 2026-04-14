import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md'
}

export default function StarRating({ value, max = 5, size = 'md' }: StarRatingProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(value)
        const partial = !filled && i < value
        return (
          <Star
            key={i}
            className={`${iconSize} ${
              filled
                ? 'fill-amber-400 text-amber-400'
                : partial
                ? 'fill-amber-200 text-amber-300'
                : 'fill-gray-100 text-gray-200'
            }`}
          />
        )
      })}
    </div>
  )
}
