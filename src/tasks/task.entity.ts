import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EnTaskStatus, ITask } from './task.model';

@Entity() // указываем, что это не просто класс, а сущность db
export class Task implements ITask {
  @PrimaryGeneratedColumn('uuid') // автогенерация колонки в db
  public id: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public status: EnTaskStatus;
}
