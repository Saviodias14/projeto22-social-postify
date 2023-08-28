import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, PrismaModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        prisma = await moduleFixture.resolve(PrismaService); //ou o get
        await prisma.publication.deleteMany();
        await prisma.media.deleteMany();
        await prisma.post.deleteMany();
        await app.init();
    });

    it('/publications (POST)', async () => {
        const media = await prisma.media.create({
            data: { title: faker.lorem.sentence(), username: faker.internet.userName() },
            select: { id: true }
        })
        const post = await prisma.post.create({
            data: { title: faker.lorem.sentence(), text: faker.lorem.sentence(), image: faker.image.dataUri() },
            select: { id: true }
        })
        const date = faker.date.future()

        await request(app.getHttpServer())
            .post("/publications")
            .send({
                postId: post.id,
                mediaId: media.id,
                date
            })
            .expect(201)


        const publications = await prisma.publication.findMany();
        expect(publications).toHaveLength(1);
        const publication = publications[0];
        expect(publication).toEqual({
            id: expect.any(Number),
            mediaId: media.id,
            postId: post.id,
            date
        })
    })

    it('/publications (GET)', async () => {
        for (let i = 0; i < 10; i++) {
            const media = await prisma.media.create({
                data: { title: faker.lorem.sentence(), username: faker.internet.userName() },
                select: { id: true }
            })
            const post = await prisma.post.create({
                data: { title: faker.lorem.sentence(), text: faker.lorem.sentence(), image: faker.image.dataUri() },
                select: { id: true }
            })
            const date = faker.date.future()
            await prisma.publication.create({
                data: {
                    mediaId: media.id,
                    postId: post.id,
                    date
                }
            })
        }
        let response = await request(app.getHttpServer()).get('/publications');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(10);
    });

    it('/publications/:id (GET)', async () => {
        const media = await prisma.media.create({
            data: { title: faker.lorem.sentence(), username: faker.internet.userName() },
            select: { id: true }
        })
        const post = await prisma.post.create({
            data: { title: faker.lorem.sentence(), text: faker.lorem.sentence(), image: faker.image.dataUri() },
            select: { id: true }
        })
        const date = faker.date.future()
        const {id, mediaId, postId} = await prisma.publication.create({
            data: {
                mediaId: media.id,
                postId: post.id,
                date
            }
        })
        let response = await request(app.getHttpServer()).get(`/publications/${id}`);

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id, mediaId, postId, date: new Date(date).toISOString()
        })
    })

    it('/publications/:id (PUT)', async () => {
        const media = await prisma.media.create({
            data: { title: faker.lorem.sentence(), username: faker.internet.userName() },
            select: { id: true }
        })
        const post = await prisma.post.create({
            data: { title: faker.lorem.sentence(), text: faker.lorem.sentence(), image: faker.image.dataUri() },
            select: { id: true }
        })
        const date = faker.date.future()
        const {id} = await prisma.publication.create({
            data: {
                mediaId: media.id,
                postId: post.id,
                date
            }
        })
        const newMedia = await prisma.media.create({
            data: { title: faker.lorem.sentence(), username: faker.internet.userName() },
            select: { id: true }
        })
        const newPost = await prisma.post.create({
            data: { title: faker.lorem.sentence(), text: faker.lorem.sentence(), image: faker.image.dataUri() },
            select: { id: true }
        })
        await request(app.getHttpServer())
            .put(`/publications/${id}`)
            .send({
                mediaId: newMedia.id,
                postId: newPost.id,
                date
            }).expect(200)

        const publications = await prisma.publication.findMany()
        expect(publications).toHaveLength(1);
        const publication = publications[0];
        expect(publication).toEqual({
            id: expect.any(Number),
            mediaId: newMedia.id,
            postId: newPost.id,
            date
        })
    })

    it('/publications/:id (DELETE)', async () => {
        const media = await prisma.media.create({
            data: { title: faker.lorem.sentence(), username: faker.internet.userName() },
            select: { id: true }
        })
        const post = await prisma.post.create({
            data: { title: faker.lorem.sentence(), text: faker.lorem.sentence(), image: faker.image.dataUri() },
            select: { id: true }
        })
        const date = faker.date.future()
        const {id} = await prisma.publication.create({
            data: {
                mediaId: media.id,
                postId: post.id,
                date
            }
        })
        await request(app.getHttpServer()).delete(`/publications/${id}`).expect(200)
        const result = await prisma.publication.findFirst({ where: { id } })
        expect(result).toEqual(null)
    })
})
