// fixes a bug for next-auth and mongodb atlas somehow
// https://github.com/nextauthjs/next-auth/issues/833
import 'reflect-metadata'
import * as React from 'react'
import '../styles/globals.css'
import { Provider } from 'next-auth/client'
import { defaultTheme, ThemeProvider } from 'evergreen-ui'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider value={defaultTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
