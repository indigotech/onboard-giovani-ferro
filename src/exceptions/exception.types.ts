export interface ExceptionResponse {
  message?: string;
  code?: string;
  details?: string;
};

export interface ErrorResponse {
  message: string;
  code: string;
  details?: string | string[];
};

export interface CustomError extends ErrorResponse {
  statusCode: number;
};
