import React, { Component } from 'react'
import { withIndexedDb } from '../hoc/with-indexed-db'

export class TestComponentView extends Component<{ connected: boolean }> {
  public render () {
    return <div>Test Component {this.props.connected.toString()}</div>
  }
}

export const TestComponent = withIndexedDb('workspaces')(TestComponentView)
