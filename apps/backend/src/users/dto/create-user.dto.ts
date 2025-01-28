import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { UserGender, UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @Min(13)
  @Max(120)
  @IsOptional()
  age?: number;

  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;

  @IsString()
  @IsOptional()
  digestTime?: string = '08:00';

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;

  @IsString()
  @IsEnum(['email', 'whatsapp'])
  @IsOptional()
  digestChannel?: 'email' | 'whatsapp' = 'email';
}
