import Layout from "../../components/layout";
import Date from "../../components/date";
import { getPosts, getPost } from "../../lib/posts";
import type { Post } from "../../lib/posts";
import utilStyles from "../../styles/utils.module.css";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as dark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

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
      <Markdown
        children={post.markdown}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={dark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      />
    </Layout>
  );
}
