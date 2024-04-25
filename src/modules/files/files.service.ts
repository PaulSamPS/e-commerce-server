import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element-response.response';
import { path } from 'app-root-path';
import { emptyDir, ensureDir, writeFile } from 'fs-extra';
import { MFile } from './mfile.class';
import * as sharp from 'sharp';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  private async saveFile(
    files: MFile[],
    name: string,
    folder: string,
  ): Promise<FileElementResponse[]> {
    const uploadFolder = `${path}/uploads/${folder}/${name}`;
    await ensureDir(uploadFolder);
    const res: FileElementResponse[] = [];

    for (const file of files) {
      const fileName = `${uuid.v4().split('.')[0]}.${file.originalname
        .split('.')
        .pop()}`;
      const buffer = await sharp(file.buffer).toBuffer();
      await writeFile(`${uploadFolder}/${fileName}`, buffer);
      res.push({
        url: `/static/${folder}/${name}/${fileName}`,
        name: fileName,
      });
    }

    return res;
  }

  private async convertToWebp(files: Express.Multer.File[]): Promise<MFile[]> {
    const imagesArr: MFile[] = [];
    for (const file of files) {
      if (file.mimetype && file.mimetype.includes('image')) {
        const fileName = `${uuid.v4().split('.')[0]}.webp`;
        const buffer = await sharp(file.buffer).webp().toBuffer();
        imagesArr.push({
          originalname: fileName,
          buffer: buffer,
        });
      }
    }
    return imagesArr;
  }

  async removeFile(username: string): Promise<void> {
    await emptyDir(`${path}/uploads/profile/${username}`);
  }

  private async saveFileOne(
    file: MFile,
    name: string,
    folder: string,
  ): Promise<FileElementResponse> {
    const uploadFolder = `${path}/uploads/${folder}/${name}`;
    await ensureDir(uploadFolder);

    const fileName = `${uuid.v4().split('.')[0]}.${file.originalname
      .split('.')
      .pop()}`;
    const buffer = await sharp(file.buffer).toBuffer();
    await writeFile(`${uploadFolder}/${fileName}`, buffer);

    return {
      url: `/static/${folder}/${name}/${fileName}`,
      name: fileName,
    };
  }

  private async convertToWebpOne(file: Express.Multer.File[]): Promise<MFile> {
    if (file[0].mimetype && file[0].mimetype.includes('image')) {
      const fileName = `${uuid.v4().split('.')[0]}.webp`;
      const buffer = await sharp(file[0].buffer).webp().toBuffer();
      return {
        originalname: fileName,
        buffer: buffer,
      };
    }
    return null;
  }

  async processAndSaveOneImage(
    files: Express.Multer.File[],
    name: string,
    folder: string,
  ): Promise<FileElementResponse> {
    const image: MFile = await this.convertToWebpOne(files);
    return await this.saveFileOne(image, name, folder);
  }

  async processAndSaveImages(
    file: Express.Multer.File[],
    name: string,
    folder: string,
  ): Promise<FileElementResponse[]> {
    const imagesArr: MFile[] = await this.convertToWebp(file);
    return await this.saveFile(imagesArr, name, folder);
  }
}
