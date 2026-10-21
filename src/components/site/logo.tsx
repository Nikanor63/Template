import Link from 'next/link'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`logo-link flex items-center text-2xl font-extrabold uppercase ${className}`}>
      Bara_CV 
    </Link>
  )
}
