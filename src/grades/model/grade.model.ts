import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Student } from 'src/students/model/student.model';

@Table({ tableName: 'grades', updatedAt: false })
export class Grade extends Model<Grade> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  grade: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subject: string;
  @ForeignKey(() => Student)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  studentId: string;

  @BelongsTo(() => Student)
  student: Student;
}
