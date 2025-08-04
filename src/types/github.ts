export interface GistFile {
  filename: string
  type: string
  language: string
  raw_url: string
  size: number
}

export interface GistFileFull extends GistFile {
  truncated: boolean
  content: string
  encoding: string
}

export interface GistOwner {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  user_view_type: string
  site_admin: boolean
}

export interface GistChangeStatus {
  total: number
  additions: number
  deletions: number
}

export interface GistHistoryItem {
  user: GistOwner
  version: string
  committed_at: string
  change_status: GistChangeStatus
  url: string
}

interface GistMinimal {
  url: string
  forks_url: string
  commits_url: string
  id: string
  node_id: string
  git_pull_url: string
  git_push_url: string
  html_url: string
  files: Record<string, GistFile>
  public: boolean
  created_at: string
  updated_at: string
  description: string
  comments: number
  user: null
  comments_enabled: boolean
  comments_url: string
  owner: GistOwner
}

export interface GistShort extends GistMinimal {
  truncated: boolean
}

export interface Gist extends GistMinimal {
  files: Record<string, GistFileFull>
  forks: unknown[]
  history: GistHistoryItem[]
  truncated: boolean
}

export type Gists = GistShort[]
