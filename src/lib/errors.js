export const ERROR_CATEGORIES = {
  FILE_FORMAT: 'file-format',
  CONTENT_FORMAT: 'content-format'
};

export class ValidationError extends Error {
  constructor(category, message, details = []) {
    super(message);
    this.name = 'ValidationError';
    this.category = category;
    this.details = details;
  }
}

export function fileFormatError(message = 'Файл должен быть валидным XLSX workbook.') {
  return new ValidationError(ERROR_CATEGORIES.FILE_FORMAT, message);
}

export function contentFormatError(message, details = []) {
  return new ValidationError(ERROR_CATEGORIES.CONTENT_FORMAT, message, details);
}

export function formatUserError(error) {
  if (!(error instanceof ValidationError)) {
    return 'Не удалось обработать файл. Проверьте формат и попробуйте ещё раз.';
  }

  if (error.details.length === 0) {
    return error.message;
  }

  return `${error.message}: ${error.details.join('; ')}`;
}
