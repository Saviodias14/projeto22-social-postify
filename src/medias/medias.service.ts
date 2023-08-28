import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';
import { MediasRepository } from './medias.repository';
import { mediasDTO } from '../dto/mediaDto';

@Injectable()
export class MediasService {

    constructor(private readonly mediaRepository: MediasRepository) { }

    async postMedias(body: Omit<Media, 'id'>) {
        const existMedias = await this.mediaRepository.verifyExistsMedias(body)
        if (existMedias.length>0) {
            throw new HttpException('Conflict', HttpStatus.CONFLICT)
        }
        return await this.mediaRepository.postMedias(body)
    }

    async getMedias() {
        return await this.mediaRepository.getMedias()
    }

    async getMediaById(id: number) {
        const result = await this.mediaRepository.getMediaById(id)
        if (!result) {
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        return result
    }

    async updateMedia(id: number, body: mediasDTO) {
        const media = await this.mediaRepository.getMediaById(id)
        if (!media) {
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        const existMedias = await this.mediaRepository.verifyExistsMedias(body)
        if (existMedias.length>0) {
            throw new HttpException('Conflict', HttpStatus.CONFLICT)
        }
        return await this.mediaRepository.updateMedia(id, body)
    }

    async deleteMedia(id: number){
        const media = await this.mediaRepository.getMediaById(id)
        if (!media) {
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        const existPublication = await this.mediaRepository.findPublication(id)
        if(existPublication){
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
        return await this.mediaRepository.deleteMedia(id)
    }
}
