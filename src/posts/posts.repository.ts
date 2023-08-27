import { Injectable } from '@nestjs/common';
import { postDTO } from 'src/dto/postDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsRepository {
    constructor(private prisma: PrismaService) { }

    postPosts(data: postDTO) {
        return this.prisma.post.create({ data })
    }

    getPosts() {
        return this.prisma.post.findMany()
    }

    getPostById(id: number) {
        return this.prisma.post.findUnique({
            where: { id },
            select: { id: true, text: true, title: true, image: true }
        })
    }

    updatePost(id: number, data: postDTO) {
        return this.prisma.post.update({
            where: { id },
            data
        })
    }
    findPublication(postId: number) {
        return this.prisma.publication.findFirst({ where: { postId } })
    }
    deletepost(id: number) {
        return this.prisma.post.delete({ where: { id } })
    }
}
