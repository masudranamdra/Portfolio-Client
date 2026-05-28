export const ADMIN_EMAILS = [
  'masud.dev01@gmail.com',
  'mr3377006@gmail.com',
  'masudranamdra@gmail.com',
];

export const isAdminEmail = (email?: string | null) =>
  !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase());
