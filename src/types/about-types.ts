export type TVersion = {
  version: string,
  date: string,
  logs: Array<TLogs>,
}

export type TLogs = {
  type: 'new' | 'fix' | 'info' | 'delete',
  text: string,
}