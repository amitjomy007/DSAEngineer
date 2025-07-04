export interface IProblem {
  isApproved: boolean;
  problemAuthorId: string; // MongoDB ObjectId as string
  problemCreatedDate?: string; // ISO string, optional (defaulted to Date.now)
  problemLastModifiedDate?: string;

  problemNumber: number;
  title: string;
  titleSlug: string;

  difficulty: "Easy" | "Medium" | "Hard" | string;
  tags: string[]; // Required, so no "?"

  description: string;

  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];

  constraints?: string[];

  hints?: string[];

  testcases?: {
    input: string;
    output: string;
  }[];

  timeLimit?: number; // default: 1
  memoryLimit?: number; // default: 128

  allowedLanguages?: string[]; // default: ["javascript", "python", "java", "cpp"]

  problemUpVote?: string; // ObjectId as string
  problemDownVote?: string; // ObjectId as string
  editorialId?: string; // ObjectId as string
}
