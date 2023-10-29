import { Controller, Get, Query } from '@nestjs/common';
import { GradesService } from './grades.service';
import { QueryLessonsDto } from 'src/grades/dto/query-lessons.dto';

@Controller()
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('log')
  getAllLessons(@Query() query: QueryLessonsDto) {
    const { page, pageSize } = query;
    return this.gradesService.getAllGrades(page, pageSize);
  }
}
