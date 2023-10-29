import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { Grade } from './model/grade.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [GradesController],
  providers: [GradesService],
  imports: [SequelizeModule.forFeature([Grade])],
  exports: [GradesService],
})
export class GradesModule {}
