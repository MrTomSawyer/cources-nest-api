import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class ProductCharacteristicsDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class createProductDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsString()
  price: number;

  @IsOptional()
  @IsNumber()
  oldPrice?: number;

  @IsNumber()
  credit: number;

  @IsString()
  description: string;

  @IsString()
  advantages: string;

  @IsString()
  disadvantages: string;

  @IsArray()
  @IsString({each: true})
  categories: string[];

  @IsArray()
  @IsString({each: true})
  tags: string[];

  @IsArray()
  @ValidateNested()
  @Type(() => ProductCharacteristicsDto)
  characteristics: ProductCharacteristicsDto[];
}
