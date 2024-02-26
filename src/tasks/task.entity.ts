import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EnTaskStatus } from './task-status.enum';
import { UserEntity } from '../auth/user.entity';

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

  @ManyToOne(
    (_) => UserEntity,
    (user: UserEntity): TaskEntity[] => user.tasks,
    { eager: false },
  )
  public user: UserEntity;
}
