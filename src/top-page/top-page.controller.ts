import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/idValidation.pipe';
import { CreateTopPageDto } from './dto/createTopPage.dto';
import { FindTopPageDto } from './dto/FindTopPage.dto';
import { PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);
    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return page;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias);
    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return page;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = await this.topPageService.deleteById(id);
    if (!deletedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: TopPageModel) {
    const updatedPage = await this.topPageService.updateById(id, dto);
    if (!updatedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return updatedPage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }
}
