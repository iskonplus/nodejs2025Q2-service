import {
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const httpErrors = {
  notFound: (message: string) => {
    return new NotFoundException(message);
  },

  forbidden: (message: string) => {
    return new ForbiddenException(message);
  },

  unprocessable: (message: string) => {
    return new UnprocessableEntityException(message);
  },
};
