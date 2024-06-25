import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('HOST'),
  port: configService.getOrThrow('PORT'),
  username: configService.getOrThrow('DBUSER'),
  password: configService.getOrThrow('PASSWORD'),
  database: configService.getOrThrow('NAME'),
  entities: [__dirname + '/**/*.entity{.js, .ts}'],
  migrations: [__dirname + '/migrations/**/*.ts'],
});
