import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('statistic/:studentId')
  getStudentStat(@Param('studentId') studentId: string) {
    return this.studentsService.getStudentStat(studentId);
  }
}
