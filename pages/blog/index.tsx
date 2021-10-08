import React from 'react'
import { Pane, majorScale, Spinner } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import orderby from 'lodash.orderby'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../content'
import { useRouter } from 'next/router'

const BlogPost = ({ posts }) => {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }

  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  posts: [],
}

export default BlogPost

/**
 * Need to get the posts from the
 * fs and our CMS
 */
// at the bottom
// export async function getStaticPaths() {
//   const postsDirectory = path.join(process.cwd(), 'posts')
//   const filenames = fs.readdirSync(postsDirectory)
//   const paths = filenames.map((name) => ({ params: { slug: name.replace('.mdx', '') } }))
//   // dont get paths for cms posts, instead, let fallback handle it
//   return { paths, fallback: true }
// }

export async function getStaticProps(ctx) {
  // read the posts dir from the fs
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)
  // check that preview boolean
  const cmsPosts = ctx.prevew ? postsFromCMS.draft : postsFromCMS.published
  // get each post from the fs
  const filePosts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    return fs.readFileSync(filePath, 'utf8')
  })

  // merge our posts from our CMS and fs then sort by pub date
  const posts = orderby(
    [...cmsPosts, ...filePosts].map((content) => {
      // extract frontmatter from markdown content
      const { data } = matter(content)
      return data
    }),
    ['publishedOn'],
    ['desc'],
  )

  return { props: { posts } }
}
