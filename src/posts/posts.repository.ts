import { Injectable } from '@nestjs/common';
import { postDTO } from 'src/dto/postDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsRepository {
    constructor(private prisma: PrismaService) { }

    postPosts(data: postDTO) {
        return this.prisma.post.create({ data })
    }
}
