export interface GitHubUser {
    name: string;
    email: string;

    /** ISO string */
    date: string;
}

export interface FullGithubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

export interface Commit {
    url: string;
    author: GitHubUser;
    committer: GitHubUser;
    message: string;
    tree: {
        url: string;
        sha: string;
    };
    comment_count: number;
    verification: {
        verified: boolean;
        reason: string;
        signature: null;
        payload: null;
    };
}

export interface GitHubCommit {
    url: string;
    sha: string;
    node_id: string;
    html_url: string;
    comments_url: string;
    commit: Commit;
    author: FullGithubUser;
    committer: FullGithubUser;
    parents: {
        url: string;
        sha: string;
    }[];
}
