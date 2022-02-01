import Head from "next/head";
import styles from "../styles/utils.module.css";
import Link from "next/link";

export const title = "Aha Labs";
export const description = "Aha moments for NEAR, blockchain, & open source";

export default function Layout({ children, home = false }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={description} />
        <meta
          property="og:image"
          content="data:image/png;base64,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"
        />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/logo.png"
              height={144}
              width={144}
              alt=""
            />
            <h1 className={styles.heading2Xl}>{title}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <img
                  src="/images/logo.png"
                  height={108}
                  width={108}
                  alt=""
                />
              </a>
            </Link>
            <h2 className={`${styles.headingLg} ${styles.colorInherit}`}>
              <Link href="/">
                <a className={styles.colorInherit}>{title}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
