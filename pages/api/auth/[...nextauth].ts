import { UserSession } from './../../../types'
import { NextApiResponse, NextApiRequest } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { getSession } from 'next-auth/client'

export default (req: NextApiRequest, res: NextApiResponse) => {
  NextAuth(req, res, {
    session: {
      jwt: true,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
    database: process.env.DATABASE_URL,
    pages: {
      signIn: '/signin',
    },
  })
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: {
      session,
    },
  }
}
