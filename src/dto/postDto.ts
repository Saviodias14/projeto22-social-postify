import { IsNotEmpty, IsString } from "class-validator";

export class postDTO {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    text: string
    
    image?: string
}