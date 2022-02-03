import Layout from "../../components/layout";
import Date from "../../components/date";
import { getPosts, getPost } from "../../lib/posts";
import type { Post } from "../../lib/posts";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Markdown from "react-markdown";

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
    <Layout title={post.title} description={post.markdown} author={post.author}>
      <article>
        <h1 className={utilStyles.headingXl}>{post.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={post.date} />
        </div>
      </article>
      <Markdown children={post.markdown} />
    </Layout>
  );
}
