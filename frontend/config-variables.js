export const apiBaseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://date-designer.com'
    : 'http://localhost:5000'

export const frontendBaseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://date-designer.com'
    : 'http://localhost:3000'
