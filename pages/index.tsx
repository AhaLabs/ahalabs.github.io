import Link from "next/link";
import Date from "../components/date";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getPosts } from "../lib/posts";

export default function Home({ posts }) {
  return (
    <Layout>
      <section className={utilStyles.headingMd}>
        <p>
          Makers of{" "}
          <a
            href="https://github.com/raendev/admin"
            target="_blank"
            rel="noopener noreferrer"
          >
            RAEN
          </a>.
        </p>
        <p>Aha Moments for NEAR, blockchain, and open source.</p>
        <p>
          Visit us on{" "}
          <a
            href="https://github.com/AhaLabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>.
        </p>
      </section>
      {posts.length > 0 && (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Recent posts</h2>
          <ul className={utilStyles.list}>
            {posts.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`}>
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
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getPosts();
  return { props: { posts } };
}
