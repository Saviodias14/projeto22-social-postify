import { Injectable } from "@nestjs/common";
import { PublicationDTO } from "../dto/publicationDto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PublicationRepopsitory {
    constructor(private prisma: PrismaService) { }

    postPublication(body: PublicationDTO) {
        return this.prisma.publication.create({
            data: { mediaId: body.mediaId, postId: body.postId, date: body.date }
        })
    }

    getPublications(published: boolean, after?: Date) {
        let where: any = {};
        console.log(published)
        if (published === true) {
            where.date = { lt: new Date() };
        }

        if (after) {
            if (where.date) {
                where.date.gte = after;
            } else {
                where.date = { gte: after };
            }
        }
        console.log(where)
        return this.prisma.publication.findMany({
            where,
        });
    }
    getPublicationById(id: number) {
        return this.prisma.publication.findUnique({ where: { id } })
    }

    updatePublication(id: number, data: PublicationDTO) {
        return this.prisma.publication.update({
            where: { id },
            data
        })
    }

    deletePublication(id: number) {
        return this.prisma.publication.delete({ where: { id } })
    }
}