import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GradesModule } from './grades/grades.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Grade } from './grades/model/grade.model';
import { StudentsModule } from './students/students.module';
import { Student } from './students/model/student.model';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Grade, Student],
      autoLoadModels: true,
    }),
    GradesModule,
    StudentsModule,
    SequelizeModule.forFeature([Grade]),
  ],
  providers: [AppService],
})
export class AppModule {}
