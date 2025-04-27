import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Provider } from '../../common/enums/provider.enum';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(Provider.GOOGLE) {}
