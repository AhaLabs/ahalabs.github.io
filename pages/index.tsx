import Head from "next/head";
import Link from "next/link";
import Date from "../components/date";
import Layout, { title, description } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getUpdates } from "../lib/updates";

export default function Home({ updates }) {
  return (
    <Layout home>
      <Head>
        <title>{title}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          {description}. Visit us on{" "}
          <a
            href="https://github.com/AhaLabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Updates</h2>
        <ul className={utilStyles.list}>
          {updates.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/updates/${date}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const updates = getUpdates();
  return { props: { updates } };
}
