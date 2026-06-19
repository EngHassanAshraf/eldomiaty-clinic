export const FILE_SELECT = {
  id: true,
  title: true,
  description: true,
  isPaidContent: true,
  createdAt: true,
} as const;

export function toFileRecord(file: {
  id: string;
  title: string;
  description: string | null;
  isPaidContent: boolean;
  createdAt: Date;
}) {
  return {
    id: file.id,
    title: file.title,
    description: file.description ?? undefined,
    isPaidContent: file.isPaidContent,
    createdAt: file.createdAt.toISOString(),
  };
}
