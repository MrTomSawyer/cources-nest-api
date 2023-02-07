import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { createProductDto } from './dto/createProduct.dto';
import { FindProductDto } from './dto/findProduct.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductModel } from './product.model/product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() dto: createProductDto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    return product;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleteDproduct = await this.productService.deleteById(id);
    if (!deleteDproduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: ProductModel) {
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
