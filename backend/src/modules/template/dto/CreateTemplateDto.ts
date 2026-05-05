import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export enum TemplateCategory {
  GLOBAL = 'GLOBAL',
  USER = 'USER',
}

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsString()
  @IsNotEmpty()
  whatsappTemplateName!: string;

  @IsEnum(TemplateCategory)
  category!: TemplateCategory;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  variables?: string[];
}