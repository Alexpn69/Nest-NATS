import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Student } from './model/student.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStudentDto } from './dto/create.student.dto';
import { Grade } from 'src/grades/model/grade.model';
import { StatisticStudentDto } from './dto/statistis.student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student) private studentModel: typeof Student,
    @InjectModel(Grade) private readonly gradeModel: typeof Grade, //   private readonly sequelize: Sequelize, // private readonly sequelize: Sequelize,
  ) {}

  async findStudentById(studentId: string): Promise<Student> {
    return await this.studentModel.findOne({
      where: { studentId: studentId },
    });
  }

  async addStudent(student: CreateStudentDto): Promise<Student> {
    const currentStudent = await this.findStudentById(student.studentId);
    if (currentStudent) {
      throw new ConflictException('Student with this ID already exists.');
    }
    return await this.studentModel.create(student);
  }

  async getStudentStat(studentId: string): Promise<StatisticStudentDto> {
    const currentStudent = await this.findStudentById(studentId);
    if (!currentStudent) {
      throw new HttpException(
        'There isnt student with such ID.',
        HttpStatus.NOT_FOUND,
      );
    }
    const { dataValues: student } = currentStudent;
    const allSubjects = await this.gradeModel.findAll({
      attributes: [
        [
          this.gradeModel.sequelize.fn(
            'DISTINCT',
            this.gradeModel.sequelize.col('subject'),
          ),
          'subject',
        ],
      ],
      raw: true,
    });

    const result: { [subject: string]: number } = {};
    allSubjects.forEach((subject) => {
      result[subject['subject']] = 0;
    });
    const subjectCounts = await this.gradeModel.findAll({
      attributes: [
        'subject',
        [
          this.gradeModel.sequelize.fn(
            'COUNT',
            this.gradeModel.sequelize.col('subject'),
          ),
          'count',
        ],
      ],
      where: { studentId: studentId },
      group: ['subject'],
      raw: true,
    });

    subjectCounts.forEach((subject) => {
      const subjectName = subject['subject'];
      const count = parseInt(subject['count'], 10);
      result[subjectName] = count;
    });
    const stat: any[] = [];
    for (const [subject, count] of Object.entries(result)) {
      const subjectStats = await this.gradeModel.findOne({
        attributes: [
          [
            this.gradeModel.sequelize.fn(
              'MAX',
              this.gradeModel.sequelize.col('grade'),
            ),
            'max',
          ],
          [
            this.gradeModel.sequelize.fn(
              'MIN',
              this.gradeModel.sequelize.col('grade'),
            ),
            'min',
          ],
          [
            this.gradeModel.sequelize.fn(
              'AVG',
              this.gradeModel.sequelize.col('grade'),
            ),
            'avg',
          ],
        ],
        where: {
          studentId: studentId,
          subject: subject,
        },
        raw: true,
      });

      const max = subjectStats ? parseInt(subjectStats['max'], 10) : 0;
      const min = subjectStats ? parseInt(subjectStats['min'], 10) : 0;
      const total = count;
      const avg = subjectStats ? parseFloat(subjectStats['avg']).toFixed(2) : 0;

      stat.push({ subject, max, min, total, avg });
    }

    return { student: { ...student }, stat };
  }
}
