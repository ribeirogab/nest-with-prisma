import { IsString, IsOptional } from 'class-validator';

export class UpsertBookDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  bar_code: string;
}
