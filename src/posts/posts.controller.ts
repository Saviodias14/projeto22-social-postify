import { Body, Controller, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { postDTO } from 'src/dto/postDto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    postPosts(@Body() body: postDTO) {
        return this.postsService.postPosts(body)
    }
}
