import { Module } from '@nestjs/common';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { PublicationRepopsitory } from './publication.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediasRepository } from 'src/medias/medias.repository';
import { PostsRepository } from 'src/posts/posts.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PublicationController],
  providers: [PublicationService, PublicationRepopsitory, MediasRepository, PostsRepository]
})
export class PublicationModule {}
