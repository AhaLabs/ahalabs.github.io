import Image from "next/image";
import Link from "next/link";
import styles from "../styles/utils.module.css";

export default function Custom404() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image
          priority
          src="/images/404.png"
          height={144}
          width={144}
          alt="nuh uh"
        />
        <h1 className={styles.heading2Xl}>404</h1>
        <p>Page not found. Not sure what happened here. Sorry.</p>
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      </header>
    </div>
  );
}
