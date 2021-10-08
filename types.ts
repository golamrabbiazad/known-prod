import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export type PostFrontMatter = {
  title: string
  summary: string
  publishedOn: string
}

export type Post = {
  source: string
  frontMatter: PostFrontMatter
}

export type UserSession = {
  id?: string
  name?: string
  email?: string
  image?: string
}

export interface Request extends NextApiRequest {
  db: Db
  dbClient: MongoClient
  user: { email: string; id: string }
}
