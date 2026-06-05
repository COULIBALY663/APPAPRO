import {ApiProperty} from "@nestjs/swagger";
export class CreateLoginDto {
    @ApiProperty({
        example: "moussaouattara@gmail.com"
    })
    email!: string;
    @ApiProperty({
        example: "12345678"
    })
    password!: string;
}
export class DeleteLoginDto {
    @ApiProperty({
        example: 1
    })
    id_login!: number;
}