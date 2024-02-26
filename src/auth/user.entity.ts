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

  @OneToMany((_) => TaskEntity, (task: TaskEntity): UserEntity => task.user, {
    eager: true,
  })
  public tasks: TaskEntity[];
}
