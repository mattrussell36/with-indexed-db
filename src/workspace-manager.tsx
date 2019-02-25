import gql from 'graphql-tag'
import React, { Component } from 'react'
import { compose, graphql, MutationOptions } from 'react-apollo'
import { withIndexedDb } from './hoc/with-indexed-db'

interface Workspace {
  id: number
  title: string
}

interface WorkspaceManagerProps {
  workspaces: Workspace[]
  connected: boolean
  getAll: any
  addWorkspace: (args: MutationOptions<Workspace>) => void
  addWorkspaces: (args: MutationOptions<{ workspaces: Workspace[] }>) => void
}

interface WorkspaceManagerState {
  titleValue: string
}

export const WORKSPACE_QUERY = gql`
  query {
    workspaces @client {
      id
      title
    }
  }
`

export const ADD_WORKSPACES_QUERY = gql`
  mutation addWorkspace($workspaces: Object!) {
    addWorkspaces(workspaces: $workspaces) @client
  }
`

export const ADD_WORKSPACE_QUERY = gql`
  mutation addWorkspace($id: Number!, $title: String!) {
    addWorkspace(id: $id, title: $title) @client {
      id
      title
    }
  }
`

export class WorkspaceManagerView extends Component<
  WorkspaceManagerProps,
  WorkspaceManagerState
> {
  public state = {
    titleValue: '',
  }

  public getWorkspaces = async () => {
    console.log('ws-manager get ws')
    const workspaces = await this.props.getAll()
    console.log(workspaces)
    // this.props.addWorkspaces({ variables: { workspaces } })
  }

  public handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ titleValue: e.currentTarget.value })
  }

  public handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.addWorkspace({
      variables: { title: this.state.titleValue },
    })
  }

  public componentDidMount () {
    this.getWorkspaces()
  }

  public render () {
    return (
      <div>
        <p>{this.props.connected.toString()}</p>
        <ul>
          {this.props.workspaces.map(workspace => (
            <li key={workspace.id}>
              <div>id: {workspace.id}</div>
              <div>title: {workspace.title}</div>
            </li>
          ))}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <input
            type='text'
            onChange={this.handleChange}
            value={this.state.titleValue}
          />
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  }
}

const withWorkspaces = graphql(WORKSPACE_QUERY, {
  props: ({ data }) => {
    return {
      // @ts-ignore
      workspaces: data.workspaces,
    }
  },
})

const withAddWorkspace = graphql(ADD_WORKSPACE_QUERY, { name: 'addWorkspace' })
const withAddWorkspaces = graphql(ADD_WORKSPACES_QUERY, {
  name: 'addWorkspaces',
})

export const WorkspaceManager = compose(
  withIndexedDb('workspaces'),
  withWorkspaces,
  withAddWorkspace,
  withAddWorkspaces,
)(WorkspaceManagerView)
