export const scopes = [
  'commands',
];

export const approvedWorkspaces = process.env.APPROVED_WORKSPACES ? process.env.APPROVED_WORKSPACES.split(',') : [];
export const approvedEnterprises = process.env.APPROVED_ENTERPRISES ? process.env.APPROVED_ENTERPRISES.split(',') : [];
