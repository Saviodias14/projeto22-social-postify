import { Injectable } from "@nestjs/common";
import { mediasDTO } from "src/dto/mediaDto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MediasRepository {
    constructor(private prisma: PrismaService) { }

    verifyExistsMedias(body: mediasDTO) {
        return this.prisma.media.findMany({
            where: { title: body.title, username: body.username },
            select: { id: true }
        })
    }

    postMedias(data: mediasDTO) {
        return this.prisma.media.create({
            data
        })
    }
    getMedias() {
        return this.prisma.media.findMany()
    }

    getMediaById(id: number) {
        return this.prisma.media.findFirst({
            where: { id: id },
            select: { id: true, title: true, username: true }
        })
    }

    updateMedia(id: number, body: mediasDTO) {
        return this.prisma.media.update({
            where: { id },
            data: { username: body.username, title: body.title }
        })
    }

    findPublication(mediaId: number) {
        return this.prisma.publication.findFirst({ where: { mediaId } })
    }
    deleteMedia(id: number) {
        return this.prisma.media.delete({ where: { id } })
    }
}