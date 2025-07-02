export interface IProblem {
  isApproved: boolean;
  problemAuthorId: string; // MongoDB ObjectId as string
  problemCreatedDate?: string; // ISO string, optional (will be defaulted)
  problemLastModifiedDate?: string;

  problemNumber: number;
  title: string;
  titleSlug: string;

  difficulty: "Easy" | "Medium" | "Hard" | string; // constrain if desired
  tags?: string[]; // Array of Tag ObjectIds as strings

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

  allowedLanguages?: string[]; // e.g. ["cpp", "python"]
}
