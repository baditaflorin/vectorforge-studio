import { z } from "zod";

const repoSchema = z.object({
  stargazers_count: z.number(),
  html_url: z.string(),
  open_issues_count: z.number(),
});

const commitSchema = z.object({
  sha: z.string(),
  html_url: z.string(),
  commit: z.object({
    committer: z.object({
      date: z.string(),
    }),
    message: z.string(),
  }),
});

export type RepositoryInfo = z.infer<typeof repoSchema>;
export type CommitInfo = z.infer<typeof commitSchema>;

export async function fetchRepositoryInfo(): Promise<RepositoryInfo> {
  const response = await fetch(
    "https://api.github.com/repos/baditaflorin/vectorforge-studio",
  );
  if (!response.ok) {
    throw new Error("GitHub repository metadata is unavailable.");
  }
  return repoSchema.parse(await response.json());
}

export async function fetchLatestCommit(): Promise<CommitInfo> {
  const response = await fetch(
    "https://api.github.com/repos/baditaflorin/vectorforge-studio/commits/main",
  );
  if (!response.ok) {
    throw new Error("GitHub commit metadata is unavailable.");
  }
  return commitSchema.parse(await response.json());
}
