export const ROLES={
    ADMIN:"admin",
    AUTHOR:"author",
} as const;

export type Role=typeof ROLES[keyof typeof ROLES];