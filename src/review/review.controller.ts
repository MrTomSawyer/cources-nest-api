import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { IdValidationPipe } from '../pipes/idValidation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/createReview.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';

@Controller('review')
export default class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Get('byProduct/:productId')
  async getbyProduct(@Param('productId', IdValidationPipe) productId: string) {
    this.reviewService.findByProductId(productId);
  }  
}
