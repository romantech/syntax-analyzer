export const ERROR_MESSAGES = {
  SERVER_ERROR: 'Server Error.',
  IP_UNIDENTIFIABLE: 'Client IP address not found or unidentifiable.',
  NOT_FOUND: (originalUrl: string) =>
    `The requested resource ${originalUrl} was not found. Please check your request URL and try again.`,

  MISSING_FIELD: (fieldName: string) => `${fieldName} field is required.`,
  RETRIEVE_FAILED: (resource: string) => `Failed to retrieve ${resource}.`,
  GENERATE_FAILED: (resource: string) => `Failed to generate ${resource}.`,

  SERVICE_ERROR: (service: string) => `${service} service error.`,
} as const;
