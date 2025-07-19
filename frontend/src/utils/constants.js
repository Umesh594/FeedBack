export const QUESTION_TYPES = {
  TEXT: 'text',
  MULTIPLE_CHOICE: 'multiple-choice'
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.TEXT]: 'Text Answer',
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CREATE_FORM: '/create-form',
  PUBLIC_FORM: '/form'
};

export const STORAGE_KEYS = {
  USER_TOKEN: 'feedback_platform_token',
  USER_DATA: 'feedback_platform_user',
  FORMS: 'feedback_platform_forms',
  RESPONSES: 'feedback_platform_responses'
};

export const DEFAULT_FORM_STRUCTURE = {
  id: '',
  title: '',
  description: '',
  questions: [],
  createdBy: '',
  createdAt: '',
  isActive: true
};

export const DEFAULT_QUESTION_STRUCTURE = {
  id: '',
  type: QUESTION_TYPES.TEXT,
  question: '',
  options: [], // for multiple choice
  required: true
};