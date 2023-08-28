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

  it('/medias (POST)', async () => {

    await request(app.getHttpServer())
      .post("/medias")
      .send({
        title: 'Instagram',
        username: 'Teste'
      })
      .expect(201)


    const medias = await prisma.media.findMany();
    expect(medias).toHaveLength(1);
    const media = medias[0];
    expect(media).toEqual({
      id: expect.any(Number),
      title: 'Instagram',
      username: 'Teste'
    })
  })

  it('/medias (GET)', async () => {
    for (let i = 0; i < 10; i++) {
      await prisma.media.create({
        data: {
          title: faker.database.type(),
          username: faker.database.type()
        }
      })
    }
    let response = await request(app.getHttpServer()).get('/medias');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(10);
  });

  it('/medias/:id (GET)', async () => {
    const { id, title, username } = await prisma.media.create({
      data: {
        title: faker.string.sample(),
        username: faker.string.sample()
      },
      select: { id: true, title: true, username: true }
    })
    let response = await request(app.getHttpServer()).get(`/medias/${id}`);
  
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id, title, username
    })
  })

  it('/medias/:id (PUT)', async () => {
    const { id, title, username } = await prisma.media.create({
      data: {
        title: faker.database.type(),
        username: faker.database.type()
      },
      select: { id: true, title: true, username: true }
    })
    
    await request(app.getHttpServer())
    .put(`/medias/${id}`)
    .send({
      title: 'Instagram', 
      username: 'Teste'
    }).expect(200)

    const medias = await prisma.media.findMany()
    expect(medias).toHaveLength(1);
    const media = medias[0];
    expect(media).toEqual({
      id: expect.any(Number),
      title: 'Instagram',
      username: 'Teste'
    })
  })

  it('/medias/:id (DELETE)', async() =>{
    const {id} = await prisma.media.create({
      data:{title: 'Instagram', username: 'Teste'},
      select:{id: true}
    })
    await request(app.getHttpServer()).delete(`/medias/${id}`).expect(200)
    const result = await prisma.media.findFirst({where:{id}})
    expect(result).toEqual(null)
  })
})
