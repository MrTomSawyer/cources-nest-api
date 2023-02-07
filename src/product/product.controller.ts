import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/idValidation.pipe';
import { createProductDto } from './dto/createProduct.dto';
import { FindProductDto } from './dto/findProduct.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductModel } from './product.model/product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: createProductDto) {
    return this.productService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deleteDproduct = await this.productService.deleteById(id);
    if (!deleteDproduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: ProductModel) {
    const updatedDproduct = await this.productService.updateById(id, dto);
    if (!updatedDproduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    return updatedDproduct;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
