import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { postDTO } from 'src/dto/postDto';

@Injectable()
export class PostsService {
    constructor(private readonly postsRepository: PostsRepository) { }

    async postPosts(body: postDTO) {
        return await this.postsRepository.postPosts(body)
    }
}
