import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicationRepopsitory } from './publication.repository';
import { PublicationDTO } from '../dto/publicationDto';
import { MediasRepository } from '../medias/medias.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class PublicationService {
    constructor(private readonly publucationRepository: PublicationRepopsitory,
        private readonly mediasRepository: MediasRepository,
        private readonly postsRepository: PostsRepository) { }

    async postPublication(body: PublicationDTO) {
        const existMedia = await this.mediasRepository.getMediaById(body.mediaId)
        const existPost = await this.postsRepository.getPostById(body.postId)
        if(!existMedia||!existPost){
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        return await this.publucationRepository.postPublication(body)
    }
    async getPublications(published:boolean, after:Date){
        return await this.publucationRepository.getPublications(published, after)
    }

    async getPublicationById(id:number){
        const result = await this.publucationRepository.getPublicationById(id)
        if(!result){
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        return result
    }

    async updatePublication(id: number, body: PublicationDTO){
        const existPublication = await this.publucationRepository.getPublicationById(id)
        if(!existPublication){
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        if(existPublication.date<new Date()){
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
        const existMedia = await this.mediasRepository.getMediaById(body.mediaId)
        const existPost = await this.postsRepository.getPostById(body.postId)
        if(!existMedia||!existPost){
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        return await this.publucationRepository.updatePublication(id, body)
    }

    async deletePublication(id: number) {
        const existPublication = await this.publucationRepository.getPublicationById(id)
        if(!existPublication){
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        return await this.publucationRepository.deletePublication(id)
    }
}
