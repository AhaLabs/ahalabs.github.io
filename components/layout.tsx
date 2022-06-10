import Head from "next/head";
import styles from "../styles/utils.module.css";
import Link from "next/link";

const siteTitle = "Aha Labs";

const siteDescription =
  "Makers of RAEN. Aha moments for NEAR, blockchain, & open source.";

export default function Layout({
  children,
  title = siteTitle,
  description = siteDescription,
  author = "",
}) {
  const combinedTitle = `${title}${
    title === siteTitle ? "" : ` • ${siteTitle}`
  }`;
  return (
    <div className={styles.container}>
      <Head>
        <title>{combinedTitle}</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={description} />
        <meta name="og:title" content={combinedTitle} />
        <meta name="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ahalabs.dev" />
        <meta
          property="og:image"
          content="https://ahalabs.dev/images/logo.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        {author && <meta name="twitter:creator" content={author} />}
        <meta name="twitter:title" content={combinedTitle} />
      </Head>
      <header className={styles.header}>
        {title === siteTitle ? (
          <>
            <img
              src={require("../public/images/logo.png")}
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
                  src={require("../public/images/logo.png")}
                  height={108}
                  width={108}
                  alt=""
                />
              </a>
            </Link>
            <h2 className={`${styles.headingLg} ${styles.colorInherit}`}>
              <Link href="/">
                <a className={styles.colorInherit}>{siteTitle}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {title !== siteTitle && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
