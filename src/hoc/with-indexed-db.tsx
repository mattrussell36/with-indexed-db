import React, { Component } from 'react'
import * as indexedDB from '../indexed-db'

interface IndexedDbProps {
  connected: boolean
}

let connected = false

indexedDB.start(() => {
  connected = true
})

export function withIndexedDb (collection: string) {
  return <T extends IndexedDbProps = IndexedDbProps>(
    WrappedComponent: React.ComponentType<T>,
  ) => {
    return class ComponentWithIndexedDb extends Component<
      {},
      { connected: boolean }
    > {
      public interval: any
      public state = {
        connected: false,
      }

      public checkIfConnected = () => {
        if (connected) {
          indexedDB.onSuccess(collection)
          this.setState({ connected: true })
          clearInterval(this.interval)
        }
      }

      public componentDidMount () {
        this.interval = setInterval(this.checkIfConnected, 100)
      }

      public render () {
        if (!this.state.connected) {
          return null
        }

        return (
          <WrappedComponent getAll={indexedDB.getAll} {...this.state as T} />
        )
      }
    }
  }
}
