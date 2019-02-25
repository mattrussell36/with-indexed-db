import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink, Operation, split } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { withClientState } from 'apollo-link-state'
import { defaultState } from './defaults'
import { resolvers } from './resolvers'

function createClient () {
  const cache = new InMemoryCache()
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map((e: any) =>
        console.error(
          `[GraphQL error]: Message: ${e.message}, Location: ${
            e.locations
          }, Path: ${e.path}`,
          e,
        ),
      )
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`, networkError)
    }
  })

  const stateLink = withClientState({
    cache,
    defaults: defaultState,
    resolvers,
  })

  return new ApolloClient({
    cache,
    connectToDevTools: true,
    link: ApolloLink.from([stateLink, errorLink]),
  })
}

export const client = createClient()
