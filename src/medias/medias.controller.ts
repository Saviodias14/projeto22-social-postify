import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { MediasService } from './medias.service';
import { mediasDTO } from 'src/dto/mediaDto';

@Controller('medias')
export class MediasController {
    constructor(private readonly mediasService :MediasService){}

    @Post()
    postMedia(@Body() body: mediasDTO){
        return this.mediasService.postMedias(body)
    }

    @Get()
    getMedias(){
        return this.mediasService.getMedias()
    }

    @Get('/:id')
    getMediaById(@Param('id') id:string){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.mediasService.getMediaById(newId)
    }

    @Put('/:id')
    updateMedia(@Body() body: mediasDTO, @Param('id') id:string){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.mediasService.updateMedia(newId, body)
    }

    @Delete(':id')
    deleteMedia(@Param('id') id: string){
        const newId = parseInt(id)
        if(isNaN(newId)){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
        }
        return this.mediasService.deleteMedia(newId)
    }
}
