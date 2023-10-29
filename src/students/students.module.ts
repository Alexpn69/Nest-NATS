import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './model/student.model';
import { Grade } from 'src/grades/model/grade.model';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports: [SequelizeModule.forFeature([Student, Grade])],
  exports: [StudentsService],
})
export class StudentsModule {}
