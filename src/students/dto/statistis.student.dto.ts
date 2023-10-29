export class StatisticStudentDto {
  student: {
    studentId: string;
    name: string;
    lastName: string;
  };
  stat: {
    subject: string;
    max: number;
    min: number;
    avg: number;
    total: number;
  }[];
}
