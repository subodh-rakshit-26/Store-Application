import { Link, useLocation } from 'react-router-dom'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import { useAppSelector } from '../store/hooks'
import { selectCartItemCount } from '../store/slices/cartSlice'

function LogoMark() {
  return (
    <svg
      className="site-header__mark-svg"
      viewBox="0 0 40 40"
      width="40"
      height="40"
      aria-hidden
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#c45c3e" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="rgba(30,58,95,0.08)" />
      <path
        d="M8 28 L14 12 L20 28"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 28 L22 12 L28 28"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d="M24 28 L30 12 L36 28"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
    </svg>
  )
}

export function Header() {
  const count = useAppSelector(selectCartItemCount)
  const location = useLocation()

  return (
    <header className="site-header">
      <div className="site-header__glow" aria-hidden />
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo">
          <LogoMark />
          <span className="site-header__brand">
            <span className="site-header__name">Store</span>
            <span className="site-header__tagline">Tees &amp; threads</span>
          </span>
        </Link>
        <nav className="site-header__nav" aria-label="Main">
          <Link
            to="/"
            className={
              location.pathname === '/' ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Products
          </Link>
          <Link to="/cart" className="site-header__cart-link" aria-label="Shopping cart">
            <span className="site-header__cart-wrap">
              <ShoppingCartOutlined className="site-header__cart-icon" />
              {count > 0 && (
                <span className="site-header__badge" aria-live="polite">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
