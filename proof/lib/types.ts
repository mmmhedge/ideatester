export type Cluster = {
  slug: string;
  name: string;
  official: boolean;
};

export type SourceType = "work" | "topic";

export type Submission = {
  id: string;
  kind: SourceType;
  title: string;
  cluster: string;
  proposedCluster?: string;
  contributor: string;
  description: string;
  link?: string;
  thumbnailUrl?: string;
  createdAt: string;
  status: "pending" | "added" | "declined";
};

export type Entry = {
  id: string;
  submissionId?: string;
  title: string;
  cluster: string;
  contributor: string;
  description: string;
  link?: string;
  sourceType: SourceType;
  photoUrl: string;
  caption?: string;
  createdAt: string;
};

export type Status = {
  live: boolean;
  note?: string;
  updatedAt: string;
};

export type DB = {
  clusters: Cluster[];
  submissions: Submission[];
  entries: Entry[];
  status: Status;
};
