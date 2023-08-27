import { IsNotEmpty, IsString } from "class-validator";

export class mediasDTO {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    username: string
}