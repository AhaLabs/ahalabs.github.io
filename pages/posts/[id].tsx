import Layout from "../../components/layout";
import Date from "../../components/date";
import { getAllPostIds, getPostData } from "../../lib/posts";
import type { Post } from "../../lib/posts";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";

export async function getStaticProps({ params }) {
  const post = await getPostData(params.id);
  return {
    props: { post },
  };
}

export default function Post({ post }: { post: Post }) {
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

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}
