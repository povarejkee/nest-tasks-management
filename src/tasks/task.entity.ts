import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EnTaskStatus } from './task-status.enum';
import { UserEntity } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

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

  @ManyToOne(() => UserEntity, (user: UserEntity): TaskEntity[] => user.tasks, {
    eager: false,
  }) // устанавливаем связь с юзером. eager: false -- не делаем запрос за юзером в бд при получении тасок
  @Exclude({ toPlainOnly: true }) // исключаем попадание объекта юзера в ответы по запросам на таски
  public user: UserEntity;
}
