import { Injectable } from '@nestjs/common';
import { Grade } from './model/grade.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGradeDto } from './dto/create.grade.dto';
import { Student } from 'src/students/model/student.model';

@Injectable()
export class GradesService {
  constructor(@InjectModel(Grade) private gradeModel: typeof Grade) {}

  async addGrade(grade: CreateGradeDto): Promise<Grade> {
    return await this.gradeModel.create(grade);
  }
  /*Для учета даты записи новой оценки было решено не создавать доп. поле а 
использовать createdAt, которое создается БД по умолчанию
*/
  async getAllGrades(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Grade[]> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return await this.gradeModel.findAll({
      include: [
        {
          model: Student,
          attributes: ['studentId', 'name', 'lastName'],
        },
      ],
      order: [['createdAt', 'ASC']],
      offset,
      limit,
    });
  }
}
