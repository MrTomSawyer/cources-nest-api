import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateReviewDto } from './dto/createReview.dto';
import { ReviewModel } from './review.model/review.model';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>) {}

  async create(dto: CreateReviewDto): Promise<ReviewModel> {
    return this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<ReviewModel | null> {
    return this.reviewModel.findByIdAndDelete(id);
  }

  async findByProductId(productId: string): Promise<ReviewModel[]> {
    return this.reviewModel.find({productId: new Types.ObjectId(productId)}).exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel.deleteMany({productId: new Types.ObjectId(productId)}).exec();
  }
}
