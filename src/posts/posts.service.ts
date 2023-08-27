import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { postDTO } from 'src/dto/postDto';

@Injectable()
export class PostsService {
    constructor(private readonly postsRepository: PostsRepository) { }

    async postPosts(body: postDTO) {
        return await this.postsRepository.postPosts(body)
    }

    async getPosts() {
        const array = await this.postsRepository.getPosts()
        const result = array.map(item => {
            if (item.image === null) {
                const { image, ...rest } = item;
                return rest;
            }
            return item;
        })
        return result
    }

    async getPostById(id: number) {
        const result = await this.postsRepository.getPostById(id)
        if (!result) {
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        if (!result.image === null) {
            return {
                id: result.id,
                text: result.text,
                title: result.title
            }
        }
        return result
    }
    async updatePost(id: number, body: postDTO){
        const existId = await this.postsRepository.getPostById(id)
        if (!existId) {
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        return this.postsRepository.updatePost(id, body)
    }

    async deletePost(id: number){
        const post = await this.postsRepository.getPostById(id)
        if (!post) {
            throw new HttpException('Not Found Error', HttpStatus.NOT_FOUND)
        }
        const existPublication = await this.postsRepository.findPublication(id)
        if(existPublication){
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
        return await this.postsRepository.deletepost(id)
    }
}
