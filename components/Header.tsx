"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import styles from "./Header.module.css"

export default function Header() {
  const router = useRouter()
  const isHomePage = router.pathname === "/"
  const isPostAdPage = router.pathname === "/post-ad"

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg viewBox="0 0 80 32" className={styles.logoSvg}>
            <text x="0" y="26" className={styles.logoText}>
              OLX
            </text>
          </svg>
        </Link>

        <nav className={styles.nav}>
          <Link href={isPostAdPage ? "/" : "/post-ad"} className={styles.postAdButton}>
            {isPostAdPage ? <HomeIconSmall /> : <PlusIcon />}
            <span>{isPostAdPage ? "Home" : "Post Ad"}</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function HomeIconSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
