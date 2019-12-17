export const scopes = [
  'chat:write',
  'commands',
  'users:read'
];

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const approvedWorkspaces = process.env.APPROVED_WORKSPACES!.split(',');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const approvedEnterprises = process.env.APPROVED_ENTERPRISES!.split(',')
