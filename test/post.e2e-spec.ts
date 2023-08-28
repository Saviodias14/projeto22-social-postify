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

    it('/posts (POST)', async () => {
        const title = faker.string.sample()
        const text = faker.string.sample()
        const image = faker.internet.url()
        
        await request(app.getHttpServer())
            .post("/posts")
            .send({
                title,
                text,
                image
            })
            .expect(201)


        const posts = await prisma.post.findMany();
        expect(posts).toHaveLength(1);
        const post = posts[0];
        expect(post).toEqual({
            id: expect.any(Number),
            title,
            text,
            image
        })
    })

    it('/posts (GET)', async () => {
        for (let i = 0; i < 10; i++) {
            await prisma.post.create({
                data: {
                    title: faker.string.sample(),
                    text: faker.hacker.phrase(),
                    image: faker.internet.url()
                }
            })
        }
        let response = await request(app.getHttpServer()).get('/posts');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(10);
    });

    it('/posts/:id (GET)', async () => {
        const { id, title, text, image } = await prisma.post.create({
            data: {
                title: faker.string.sample(),
                text: faker.hacker.phrase(),
                image: faker.internet.url()
            },
            select: { id: true, title: true, text: true, image: true }
        })
        let response = await request(app.getHttpServer()).get(`/posts/${id}`);

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id, title, text, image
        })
    })

    it('/posts/:id (PUT)', async () => {
        const { id } = await prisma.post.create({
            data: {
                title: faker.string.sample(),
                text: faker.hacker.phrase()
            },
            select: { id: true }
        })
        const title = faker.string.sample()
        const text = faker.hacker.phrase()
        const image = faker.internet.url()
        await request(app.getHttpServer())
            .put(`/posts/${id}`)
            .send({
                title,
                text,
                image
            }).expect(200)

        const posts = await prisma.post.findMany()
        expect(posts).toHaveLength(1);
        const post = posts[0];
        expect(post).toEqual({
            id: expect.any(Number),
            title,
            text,
            image
        })
    })

    it('/posts/:id (DELETE)', async () => {
        const { id } = await prisma.post.create({
            data: {
                title: faker.string.sample(),
                text: faker.hacker.phrase(),
                image: faker.internet.url()
            },
            select: { id: true }
        })
        await request(app.getHttpServer()).delete(`/posts/${id}`).expect(200)
        const result = await prisma.post.findFirst({ where: { id } })
        expect(result).toEqual(null)
    })
})
