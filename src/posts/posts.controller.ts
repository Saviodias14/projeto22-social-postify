import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { postDTO } from 'src/dto/postDto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    postPosts(@Body() body: postDTO) {
        return this.postsService.postPosts(body)
    }

    @Get()
    getPosts(){
        return this.postsService.getPosts()
    }
    @Get(':id')
    getPostById(@Param('id') id: string){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.postsService.getPostById(newId)
    }
    @Put(':id')
    updatePost(@Param('id') id: string, @Body() body: postDTO){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.postsService.updatePost(newId, body)
    }

    @Delete(':id')
    deletePost(@Param('id') id: string){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.postsService.deletePost(newId)
    }
}
