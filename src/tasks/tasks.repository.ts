import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { EnTaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

// @EntityRepository(Task): Этот декоратор указывает, что TasksRepository является репозиторием для сущности Task.
// Он связывает этот репозиторий с конкретной сущностью базы данных.

// extends Repository<Task>: Класс TasksRepository расширяет базовый класс Repository из TypeORM и параметризован типом Task.
// Это означает, что TasksRepository предоставляет методы для выполнения
// операций базы данных (например, сохранение, поиск, обновление) для сущности Task.

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {
  public async getTaskById(id: string): Promise<TaskEntity> {
    const found: TaskEntity = await this.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Task with id '${id}' is not found`);
    }

    return found;
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description }: CreateTaskDto = createTaskDto;

    const newTask: TaskEntity = this.create({
      title,
      description,
      status: EnTaskStatus.OPEN,
    });

    await this.save(newTask);

    return newTask;
  }
}
