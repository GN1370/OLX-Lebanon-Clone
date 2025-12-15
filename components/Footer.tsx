import Link from "next/link"
import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Popular Categories</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/category/378">Cars</Link>
              </li>
              <li>
                <Link href="/category/4174">Properties</Link>
              </li>
              <li>
                <Link href="/category/387">Mobile Phones</Link>
              </li>
              <li>
                <Link href="/category/388">Electronics</Link>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>About</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/about">About OLX</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Support</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/help">Help Center</Link>
              </li>
              <li>
                <Link href="/safety">Safety Tips</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Use</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} OLX Lebanon Clone. All rights reserved.</p>
          <p className={styles.note}>This is a demo project for assessment purposes only.</p>
        </div>
      </div>
    </footer>
  )
}
