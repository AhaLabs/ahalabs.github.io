import Layout from "../../components/layout";
import Date from "../../components/date";
import { getUpdates, getUpdate } from "../../lib/updates";
import type { Update } from "../../lib/updates";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";

export async function getStaticPaths() {
  const posts = getUpdates();
  return {
    paths: posts.map(({ date }) => ({
      params: { date },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getUpdate(params.date);
  return {
    props: post,
  };
}

export default function Post(post: Update) {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{post.title}</h1>
        <div className={utilStyles.lighterText}>
          <Date dateString={post.date} />
        </div>
      </article>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </Layout>
  );
}
