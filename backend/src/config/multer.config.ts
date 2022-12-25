import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    id: string;
    username: string;
    email: string;
    profileImage: string;
  };
}

export const multerOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException('이미지 형식은 jpg, jpeg, png만 허용'),
        false,
      );
    }
  },

  storage: diskStorage({
    filename: (request: CustomRequest, file, callback) => {
      const filename = file.originalname.split('.');
      console.log(request.user);
      const editName = `${Date.now()}_${
        request?.query?.username ?? request.user.username
      }.${filename[filename.length - 1]}`;
      callback(null, editName);
    },
    destination: (request, file, callback) => {
      const uploadPath = 'upload';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      callback(null, uploadPath);
    },
  }),

  //   limits: {
  //     fileSize: 1024 * 1024 * 10,
  //   },
};
