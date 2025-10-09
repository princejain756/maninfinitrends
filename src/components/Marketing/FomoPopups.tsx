import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { products } from '@/data/products'

type FomoEvent = {
  id: string
  name: string
  city: string
  verb: string
  product: {
    id: string
    title: string
    handle: string
    image: string
    price: number
  }
  timeAgo: string
  ctaText: string
  durationMs: number
  stockLeft?: number
  badge?: string
}

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
  'Pune', 'Jaipur', 'Surat', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
]

const FIRST_NAMES = [
  'Aarav','Vivaan','Aditya','Arjun','Vihaan','Sai','Krishna','Ishaan','Kabir','Rudra',
  'Aanya','Diya','Anaya','Myra','Aarohi','Ira','Aadhya','Kiara','Amaira','Saanvi',
  'Riya','Shruti','Tanvi','Navya','Anvi','Meera','Kavya','Nisha','Aisha','Zara',
]

const VERBS_A = ['bought', 'added to cart', 'viewed', 'wishlist-ed', 'checked out']
const VERBS_B = ['just grabbed', 'secured', 'reserved', 'picked', 'snagged']

function currency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function timeAgoString(): string {
  // Bias towards recent minutes for stronger FOMO, with some longer tails.
  const buckets = [
    { min: 1, max: 12, unit: 'min' },
    { min: 13, max: 55, unit: 'min' },
    { min: 1, max: 6, unit: 'h' },
    { min: 1, max: 7, unit: 'd' },
  ] as const
  const pick = sample(buckets)
  const n = Math.max(pick.min, Math.floor(Math.random() * (pick.max - pick.min + 1)) + pick.min)
  return `${n}${pick.unit} ago`
}

function makeEvent(opts?: { focusProduct?: (typeof products)[number] | null; onProductPage?: boolean }): FomoEvent {
  const { focusProduct = null, onProductPage = false } = opts || {}
  // 65% chance to highlight the current product when on its page
  const prod = (onProductPage && Math.random() < 0.65 && focusProduct) ? focusProduct : sample(products)
  const image = prod.images?.[0] || '/api/placeholder/300/300'

  // A/B variant per event
  const variant = Math.random() < 0.5 ? 'A' : 'B'
  const verb = variant === 'A' ? sample(VERBS_A) : sample(VERBS_B)
  const ctaText = variant === 'A' ? 'Shop' : (Math.random() < 0.5 ? 'Grab Now' : 'Limited Stock')
  const durationMs = variant === 'A' ? 5400 : 6200

  // Stock badge shown primarily on product pages
  let stockLeft: number | undefined
  let badge: string | undefined
  if (onProductPage && focusProduct) {
    // Keep within 2..min(stock, 12) to feel urgent
    const maxShow = Math.max(2, Math.min(12, focusProduct.stock ?? 6))
    stockLeft = Math.max(1, Math.floor(Math.random() * maxShow) + 1)
    badge = 'Only ' + stockLeft + ' left'
  } else if (Math.random() < 0.18) {
    // Occasionally show a subtle limited badge sitewide
    stockLeft = Math.floor(Math.random() * 5) + 2
    badge = 'Only ' + stockLeft + ' left'
  }

  return {
    id: Math.random().toString(36).slice(2),
    name: sample(FIRST_NAMES) + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '.',
    city: sample(INDIAN_CITIES),
    verb,
    product: { id: prod.id, title: prod.title, handle: prod.handle, image, price: prod.price },
    timeAgo: timeAgoString(),
    ctaText,
    durationMs,
    stockLeft,
    badge,
  }
}

// Default gap ranges; may be tightened for variant B per event
const MIN_GAP_MS = 6000
const MAX_GAP_MS = 14000

export default function FomoPopups() {
  const { pathname } = useLocation()
  const isCheckout = pathname.startsWith('/checkout')
  const isCart = pathname.startsWith('/cart')
  const isProductPage = pathname.startsWith('/product/')
  const productHandle = isProductPage ? pathname.split('/')[2] : undefined
  const currentProduct = useMemo(() => products.find(p => p.handle === productHandle) || null, [productHandle])

  const [current, setCurrent] = useState<FomoEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<number | null>(null)
  const queueRef = useRef<FomoEvent[]>([])
  const dismissed = useRef<boolean>(false)

  // Seed an initial queue lazily
  const seed: FomoEvent[] = useMemo(
    () => Array.from({ length: 6 }, () => makeEvent({ focusProduct: currentProduct, onProductPage: isProductPage })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productHandle]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    dismissed.current = localStorage.getItem('fomo:dismissed') === '1'
    if (dismissed.current) return

    // Suppress on checkout (and optionally cart for cleanliness)
    if (isCheckout || isCart) return

    queueRef.current = seed
    let mounted = true

    const showNext = () => {
      if (!mounted) return
      if (dismissed.current) return

      if (queueRef.current.length < 3) {
        // Top-up queue in background
        queueRef.current.push(
          makeEvent({ focusProduct: currentProduct, onProductPage: isProductPage }),
          makeEvent({ focusProduct: currentProduct, onProductPage: isProductPage })
        )
      }

      const next = queueRef.current.shift() || makeEvent({ focusProduct: currentProduct, onProductPage: isProductPage })
      setCurrent(next)
      setVisible(true)

      // Hide after duration, then schedule next with a gap
      window.setTimeout(() => setVisible(false), next.durationMs)

      // Tighten gaps slightly for variant B (handled per-event by looking at duration)
      const localMin = next.durationMs > 5400 ? 4000 : MIN_GAP_MS
      const localMax = next.durationMs > 5400 ? 10000 : MAX_GAP_MS
      const gap = Math.floor(Math.random() * (localMax - localMin + 1)) + localMin
      timerRef.current = window.setTimeout(showNext, next.durationMs + gap) as unknown as number
    }

    // Stagger the first popup slightly after load
    timerRef.current = window.setTimeout(showNext, 2500) as unknown as number

    return () => {
      mounted = false
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [seed])

  if (!current || dismissed.current || isCheckout) return null

  return (
    <div className="fixed left-4 bottom-4 z-[60] pointer-events-none select-none">
      <FomoCard
        key={current.id}
        event={current}
        visible={visible}
        onClose={() => {
          setVisible(false)
          // Pause stream for a bit after manual close and remember preference for this session
          dismissed.current = true
          localStorage.setItem('fomo:dismissed', '1')
          if (timerRef.current) window.clearTimeout(timerRef.current)
        }}
      />
    </div>
  )
}

function FomoCard({ event, visible, onClose }: { event: FomoEvent; visible: boolean; onClose: () => void }) {
  return (
    <div
      className={[
        'pointer-events-auto w-[360px] max-w-[90vw] text-white',
        'backdrop-blur-xl bg-black/80 border border-white/15 rounded-3xl shadow-2xl',
        'transition-all duration-700 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      ].join(' ')}
      style={{ boxShadow: '0 20px 60px -15px rgba(0,0,0,0.6)' }}
      role="status"
      aria-live="polite"
    >
      <div className="p-3 pl-3 pr-2 flex gap-3 items-center">
        <img
          src={event.product.image}
          alt={event.product.title}
          className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10 shadow-md"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight">
            <span className="opacity-90">{event.name}</span>
            <span className="opacity-70"> in {event.city} </span>
            <span className="opacity-90">{event.verb}</span>
          </div>
          <div className="text-xs opacity-90 truncate">
            {event.product.title} · {currency(event.product.price)} · {event.timeAgo}
          </div>
          {event.badge && (
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 shadow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3l3.09 6.26L22 10l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.87 2 10l6.91-.74L12 3z" fill="currentColor" />
              </svg>
              {event.badge}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 pl-2">
          <Link
            to={`/product/${event.product.handle}`}
            className="inline-flex items-center gap-1 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {event.ctaText}
          </Link>
          <button
            aria-label="Close notification"
            className="/btn p-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {/* Subtle progress bar */}
      <div className="h-1 overflow-hidden rounded-b-3xl">
        <div
          className="h-full bg-white/70 origin-left"
          style={{
            transform: visible ? 'scaleX(0)' : 'scaleX(1)',
            transition: `transform ${event.durationMs}ms linear`,
          }}
        />
      </div>
    </div>
  )
}
