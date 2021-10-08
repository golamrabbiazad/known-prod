import React, { FC } from 'react'
import path from 'path'
import fs from 'fs'
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Post } from '../../types'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import { posts as postsFromCMS } from '../../content'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = serialize(source)
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
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */

export async function getStaticProps({ params, preview }) {
  let postFile: string

  try {
    const postPath = path.join(process.cwd(), 'posts', `${params.slug}.mdx`)
    postFile = fs.readFileSync(postPath, 'utf-8')
  } catch {
    const collection = preview ? postsFromCMS.draft : postsFromCMS.published
    postFile = collection.find((p) => {
      const { data } = matter(p)
      return data.slug === params.slug
    })
  }

  if (!postFile) {
    throw new Error('no post')
  }

  const { content, data } = matter(postFile)
  const mdxSource = await serialize(content, { scope: data })
  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
    revalidate: 30,
  }
}

export default BlogPost
