import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: true, credentials: true })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  // Debug: log all login requests
  app.use((req: any, _res: any, next: any) => {
    if (req.url?.includes('login') || req.url?.includes('register')) {
      console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} body:`, JSON.stringify(req.body))
    }
    next()
  })

  await app.listen(process.env.PORT || 3001)
}
bootstrap()
