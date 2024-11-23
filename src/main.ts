import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { promises as FS } from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const certificado = await FS.readFile('./CERTIFICADO_DIGITAL/clave_publica.crt');
  const llavePrivada = await FS.readFile('./CERTIFICADO_DIGITAL/clave_privada.key');

  const app = await NestFactory.create(AppModule, {
    httpsOptions:  {
      key: llavePrivada,
      cert: certificado
    }
  });

  app.enableCors({
    origin: "localhost:*",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  });

  const config = new DocumentBuilder()
    .setTitle('Seguridad')
    .setDescription('API Seguridad')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
