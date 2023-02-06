import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt';
import { UserModel } from "../auth.model/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExperation: true,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate({ email }: Pick<UserModel, "email">) {
    return email;
  }
}
