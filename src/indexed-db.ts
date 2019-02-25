interface Workspace {
  id: number
  title: string
}

let request: IDBOpenDBRequest
let db: IDBDatabase
let store: IDBObjectStore
let index: IDBIndex
let tx: IDBTransaction
let version = 1

const STORES: { [index: string]: string } = {
  workspaces: 'workspaces',
}

export function start (cb: () => void) {
  console.log('start')
  request = indexedDB.open('VEGA', version)

  request.addEventListener('success', () => {
    cb()
  })

  request.addEventListener('error', error => console.log(error))

  request.addEventListener('upgradeneeded', onUpgrade)
}

function getWorkspaceById (id: number): Promise<Workspace | undefined> {
  return new Promise((resolve, reject) => {
    const item = store.get(id)
    item.addEventListener('success', () => resolve(item.result))
    item.addEventListener('error', error => reject(error))
  })
}

function getWorkspaceByTitle (title: string): Promise<Workspace | undefined> {
  return new Promise((resolve, reject) => {
    const item = index.get(title)
    item.addEventListener('success', () => resolve(item.result))
    item.addEventListener('error', error => reject(error))
  })
}

function putWorkspace (workspace: Workspace) {
  store.put(workspace)
}

export function getAll (): Promise<Workspace[]> {
  return new Promise((resolve, reject) => {
    const items = store.getAll()
    items.addEventListener('success', () => resolve(items.result))
    items.addEventListener('error', error => reject(error))
  })
}

function setup (dbName: string) {
  db = request.result
  tx = db.transaction(STORES[dbName], 'readwrite')
  store = tx.objectStore(STORES[dbName])
  index = store.index('title')
}

export function onSuccess (dbName: string) {
  setup(dbName)

  db.addEventListener('error', error =>
    console.warn('VEGA INDEX DB ERROR', error),
  )

  // If its the first version save the default
  // workspace
  if (version === 1) {
    putWorkspace({
      id: 0,
      title: 'Default trading',
    })
  }
}

async function onUpgrade (event: any) {
  console.log('upgardeneeded', event)
  db = request.result
  version = event.newVersion

  if (version <= 1) {
    // Create the store
    store = db.createObjectStore(STORES.workspaces, { keyPath: 'id' })
    index = store.createIndex('title', 'title', { unique: false })
  }

  if (version === 2) {
    // @ts-ignore
    store = request.transaction.objectStore(STORES.workspaces)
    const items = await getAll()
    items.forEach(item => {
      item.title = 'PREFIXED-' + item.title
      putWorkspace(item)
    })
  }
}
