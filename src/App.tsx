import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { client } from './api/graphql'
import { TestComponent } from './components/test-comp'
import { WorkspaceManager } from './workspace-manager'

class App extends Component {
  public render () {
    return (
      <ApolloProvider client={client}>
        <WorkspaceManager />
        <TestComponent />
      </ApolloProvider>
    )
  }
}

export default App
