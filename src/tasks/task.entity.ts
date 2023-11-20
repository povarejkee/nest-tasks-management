import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EnTaskStatus } from './task-status.enum';

@Entity() // указываем, что это не просто класс, а сущность db
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid') // автогенерация колонки в db
  public id: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public status: EnTaskStatus;
}
