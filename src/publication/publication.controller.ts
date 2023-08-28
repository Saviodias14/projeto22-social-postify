import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationDTO } from '../dto/publicationDto';

@Controller('publications')
export class PublicationController {
    constructor(private readonly publicationService: PublicationService) { }

    @Post()
    postPublication(@Body() body: PublicationDTO) {
        return this.publicationService.postPublication(body)
    }
    @Get()
    getPublications(@Query('published') published: string, @Query('after') after: Date) {
        let newPublished = false
        if (published) {
            newPublished = JSON.parse(published)
        }
        return this.publicationService.getPublications(newPublished, after)
    }

    @Get(':id')
    getPublicationById(@Param('id') id:string){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.publicationService.getPublicationById(newId)
    }

    @Put(':id')
    updatePublication(@Body() body: PublicationDTO, @Param('id') id: string){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.publicationService.updatePublication(newId, body)
    }

    @Delete(':id')
    deletePublication(@Param('id') id:string){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.publicationService.deletePublication(newId)
    }
}
