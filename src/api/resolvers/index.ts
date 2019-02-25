import { WORKSPACE_QUERY } from '../../workspace-manager'

export const resolvers = {
  Mutation: {
    addWorkspace: (_: any, { title, id }: any, { cache }: any) => {
      const { workspaces } = cache.readQuery({ query: WORKSPACE_QUERY })
      const newWorkspace = {
        __typename: 'Workspace',
        id:
          typeof id === 'number'
            ? id
            : Math.random()
                .toString()
                .slice(-4),
        title,
      }

      cache.writeData({
        data: {
          workspaces: [...workspaces, newWorkspace],
        },
      })

      return newWorkspace
    },
    addWorkspaces: (_: any, variables: any, { cache }: any) => {
      console.log(variables)
      const { workspaces } = cache.readQuery({ query: WORKSPACE_QUERY })
      const newWorkspaces = variables.workspaces.map((w: any) => {
        w.__typename = 'Workspace'
        return w
      })

      cache.writeData({
        data: {
          workspaces: [...workspaces, ...newWorkspaces],
        },
      })

      return null
    },
  },
}
