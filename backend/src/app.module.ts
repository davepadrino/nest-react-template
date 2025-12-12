import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { HealthController } from '@presentation/controllers/health.controller';

@Module({
  imports: [UserModule],
  controllers: [HealthController],
})
export class AppModule {}
