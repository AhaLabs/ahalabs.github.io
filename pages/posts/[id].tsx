import Layout from "../../components/layout";
import Date from "../../components/date";
import { getPosts, getPost } from "../../lib/posts";
import type { Post } from "../../lib/posts";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";

export async function getStaticPaths() {
  const posts = getPosts();
  return {
    paths: posts.map(({ id }) => ({
      params: { id },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.id);
  return {
    props: post,
  };
}

export default function Post(post: Post) {
  return (
    <Layout>
      <Head>
        <title>{post.title} • Aha Labs</title>
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
