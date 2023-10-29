import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'students', timestamps: false })
export class Student extends Model<Student> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  studentId: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;
}
