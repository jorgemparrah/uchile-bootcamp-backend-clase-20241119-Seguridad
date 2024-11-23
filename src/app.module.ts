import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: "123456789",
      signOptions: {
        expiresIn: '10m'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
