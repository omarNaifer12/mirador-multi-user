import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { createWriteStream } from 'fs';
import fetch from 'node-fetch';
import { generateAlphanumericSHA1Hash } from '../hashGenerator';
import { mediaTypes } from '../../enum/mediaTypes';
import {
  getPeerTubeThumbnail,
  getPeerTubeVideoID,
  getYoutubeThumbnail,
  getYouTubeVideoID,
  isPeerTubeVideo,
  isYouTubeVideo,
} from './utils';

@Injectable()
export class MediaLinkInterceptor implements NestInterceptor {
  async processImage(buffer: Buffer, uploadPath: string): Promise<void> {
    const processedFilePath = join(uploadPath, `thumbnail.webp`);
    const sharpBuffer = await sharp(buffer)
      .resize(200, 200)
      .webp({ effort: 3 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(processedFilePath);
      writeStream.write(sharpBuffer);
      writeStream.end();
      writeStream.on('finish', () => resolve(null));
      writeStream.on('error', reject);
    });
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const url = request.body.url;
    try {
      let thumbnailBuffer: Buffer | null = null;
      let videoId: string | null = null;

      switch (true) {
        case isYouTubeVideo(url):
          videoId = getYouTubeVideoID(url);
          if (videoId) {
            thumbnailBuffer = await getYoutubeThumbnail(videoId);
          }
          request.mediaTypes = mediaTypes.VIDEO;
          break;

        case await isPeerTubeVideo(url):
          videoId = getPeerTubeVideoID(url);
          if (videoId) {
            thumbnailBuffer = await getPeerTubeThumbnail(url, videoId);
          }
          request.mediaTypes = mediaTypes.VIDEO;
          break;

        default:
          const imageResponse = await fetch(url);
          if (!imageResponse.ok) throw new Error('Failed to fetch media');
          thumbnailBuffer = Buffer.from(await imageResponse.arrayBuffer());
          request.mediaTypes = mediaTypes.IMAGE;
          break;
      }

      if (thumbnailBuffer) {
        const hash = generateAlphanumericSHA1Hash(
          `${Date.now().toString()}${Math.random().toString(36)}`,
        );
        const uploadBasePath = './upload';
        const uploadPath = join(uploadBasePath, hash);

        if (!fs.existsSync(uploadBasePath)) {
          fs.mkdirSync(uploadBasePath, { recursive: true });
        }
        fs.mkdirSync(uploadPath, { recursive: true });

        await this.processImage(thumbnailBuffer, uploadPath);
        request.generatedHash = hash;
        request.processedFilePath = join(uploadPath, `thumbnail.webp`);
      }

      return next.handle();
    } catch (error) {
      console.error(`Error processing image: ${error.message}`);
      throw new Error(`Error processing image: ${error.message}`);
    }
  }
}
