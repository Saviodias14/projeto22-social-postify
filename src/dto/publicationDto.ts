import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class PublicationDTO {
    @IsNumber()
    @IsNotEmpty()
    mediaId: number
    @IsNumber()
    @IsNotEmpty()
    postId: number
    @IsDate()
    @Type(()=>Date)
    @IsNotEmpty()
    date: string
}