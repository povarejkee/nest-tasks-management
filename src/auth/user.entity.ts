import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskEntity } from '../tasks/task.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public username: string;

  @Column()
  public password: string;

  @OneToMany(() => TaskEntity, (task: TaskEntity): UserEntity => task.user, {
    eager: true,
  }) // устанавливаем связь с тасками. eager: true -- при запросе на юзера делать запрос в бд за тасками,
  // которые относятся к этому юзеру, и помещать их в ключ "tasks" в объекте юзера
  public tasks: TaskEntity[];
}
