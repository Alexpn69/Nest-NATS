import { Injectable } from '@nestjs/common';
import { connect, StringCodec } from 'nats';
import { GradesService } from './grades/grades.service';
import { CreateGradeDto } from './grades/dto/create.grade.dto';
import { StudentsService } from './students/students.service';
import { CreateStudentDto } from './students/dto/create.student.dto';
import { Grade } from './grades/model/grade.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Grade) private userModel: typeof Grade,
    private gradeService: GradesService,
    private studentService: StudentsService,
  ) {}

  async onModuleInit() {
    //  await this.getEvents();
  }

  /*Я начал делать тестовое вечером 27.10 - подлючился к серверу, посмотрел как все работает,
решил продолжить на выходных, а в субботу сервер уже молчал))
поэтому этот код не протестирован, хорошо что в пятницу себе никидал модель json

Я решил сделать 2 таблицы: Оценки и Студенты, тк мне кажется это логичней
можно наверное еще вынести таблицу Предметов - но в рамках тестового не стал делать
*/
  getEvents = async () => {
    const nc = await connect({ servers: '192.162.246.63:4222' });
    const sc = StringCodec();
    const sub = nc.subscribe('students.v1.graded');
    (async () => {
      for await (const m of sub) {
        //Делаем новую запись в таблицу Оценок
        const gradeData = JSON.parse(sc.decode(m.data)).data;
        const grade: CreateGradeDto = {
          grade: Number(gradeData.grade),
          subject: gradeData.subject,
          studentId: gradeData.personalCode,
        };
        await this.gradeService.addGrade(grade);
        //Сразу делаем запрос за данными студента
        await nc
          .request(
            'students.v1.get',
            JSON.stringify({
              personalCode: JSON.parse(sc.decode(m.data)).data.personalCode,
            }),
          )
          /*Делаем новую запись в таблицу студентов если такого студента еще нет (проверка в
            в сервисе студентов)
          */
          .then((m) => {
            const studentData = JSON.parse(sc.decode(m.data)).data;
            const student: CreateStudentDto = {
              studentId: studentData.personalCode,
              name: studentData.name,
              lastName: studentData.lastName,
            };
            this.studentService.addStudent(student);
          })
          .catch((err) => {
            console.log(`problem with request: ${err.message}`);
          });
      }
    })();
  };
}
