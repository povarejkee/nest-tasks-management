import { Injectable, NotFoundException } from '@nestjs/common';
import { EnTaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { TaskEntity } from './task.entity';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(private entityManager: EntityManager) {}
  public async getTasks(searchTaskDto: SearchTaskDto): Promise<TaskEntity[]> {
    const { status, searchString }: SearchTaskDto = searchTaskDto;

    const query: SelectQueryBuilder<TaskEntity> =
      this.entityManager.createQueryBuilder(TaskEntity, 'task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (searchString) {
      const queryCondition: string =
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)';

      query.andWhere(queryCondition, { search: `%${searchString}%` });
    }

    // TODO реализовать поиск сразу по двум квери. Сейчас это не работает. Код ниже решает проблему, но должно быть решенение лучше:
    // if (status && searchString) {
    //   const queryCondition: string =
    //     'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search) AND task.status = :status';
    //
    //   query.andWhere(queryCondition, { search: `%${searchString}%`, status });
    // }

    return await query.getMany();
  }

  public async getTaskById(id: string): Promise<TaskEntity> {
    const found: TaskEntity = await this.entityManager.findOne(TaskEntity, {
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Task with id '${id}' is not found`);
    }

    return found;
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description }: CreateTaskDto = createTaskDto;

    const newTask: TaskEntity = this.entityManager.create(TaskEntity, {
      title,
      description,
      status: EnTaskStatus.OPEN,
    });

    await this.entityManager.save(newTask);

    return newTask;
  }

  public deleteTask(id: string): void {
    this.entityManager.delete(TaskEntity, id);
  }

  public async updateTaskStatus(
    id: string,
    status: EnTaskStatus,
  ): Promise<TaskEntity> {
    const foundTask: TaskEntity = await this.getTaskById(id);

    foundTask.status = status;

    await this.entityManager.save(foundTask);

    return foundTask;
  }
}
