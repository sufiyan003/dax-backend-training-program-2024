import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateprofileDto {
  @IsEmail()
  email?: string;

  @IsString()
  name?: string;

  @IsString()
  address?: string;

  @IsString()
  phoneNo?: string;

}