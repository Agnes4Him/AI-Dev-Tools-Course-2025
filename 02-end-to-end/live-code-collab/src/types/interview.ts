export interface Participant {
  id: string;
  name: string;
  isOnline: boolean;
  isHost: boolean;
  joinedAt: Date;
}

export interface InterviewSession {
  id: string;
  title: string;
  createdAt: Date;
  language: SupportedLanguage;
  code: string;
  participants: Participant[];
  output: ExecutionResult | null;
}

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

export interface CodeChange {
  sessionId: string;
  participantId: string;
  code: string;
  timestamp: Date;
}

export const LANGUAGE_CONFIG: Record<SupportedLanguage, { label: string; extension: string; defaultCode: string }> = {
  javascript: {
    label: 'JavaScript',
    extension: 'js',
    defaultCode: `// Welcome to the coding interview!\n// Write your solution below\n\nfunction solution(input) {\n  // Your code here\n  return input;\n}\n\n// Test your solution\nconsole.log(solution("Hello, World!"));`,
  },
  typescript: {
    label: 'TypeScript',
    extension: 'ts',
    defaultCode: `// Welcome to the coding interview!\n// Write your solution below\n\nfunction solution(input: string): string {\n  // Your code here\n  return input;\n}\n\n// Test your solution\nconsole.log(solution("Hello, World!"));`,
  },
  python: {
    label: 'Python',
    extension: 'py',
    defaultCode: `# Welcome to the coding interview!\n# Write your solution below\n\ndef solution(input):\n    # Your code here\n    return input\n\n# Test your solution\nprint(solution("Hello, World!"))`,
  },
  java: {
    label: 'Java',
    extension: 'java',
    defaultCode: `// Welcome to the coding interview!\n// Write your solution below\n\npublic class Solution {\n    public static String solution(String input) {\n        // Your code here\n        return input;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(solution("Hello, World!"));\n    }\n}`,
  },
  cpp: {
    label: 'C++',
    extension: 'cpp',
    defaultCode: `// Welcome to the coding interview!\n// Write your solution below\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstring solution(string input) {\n    // Your code here\n    return input;\n}\n\nint main() {\n    cout << solution("Hello, World!") << endl;\n    return 0;\n}`,
  },
};
