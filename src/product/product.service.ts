import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ReviewModel } from 'src/review/review.model/review.model';
import { createProductDto } from './dto/createProduct.dto';
import { FindProductDto } from './dto/findProduct.dto';
import { ProductModel } from './product.model/product.model';

@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) {}

  async create(dto: createProductDto) {
    return this.productModel.create(dto);
  }

  async findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: createProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel.aggregate([
      {
        $match: {
          categories: dto.category
        }
      },
      {
        $sort: {
          _id: 1
        }
      },
      {
        $limit: dto.limit
      },
      {
        $lookup: {
          from: 'Review',
          localField: 'id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          reviewCount: {$size: '$reviews'},
          reviewAvg: {$avg: '$reviews.rating'},
          reviews: {
            $function: {
              body: `function(reviews) {
                reviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
                return reviews;
              }`,
              args: ['$reviews'],
              lang: 'js'
            }
          }
        }
      }
    ]).exec() as unknown as (ProductModel & { review: ReviewModel[], reviewCount: number, reviewAvg: number })[];
  }
}
