import { Injectable, NotFoundException } from '@nestjs/common';
import { EnTaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { TaskEntity } from './task.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
  ) {}
  public async getTasks(searchTaskDto: SearchTaskDto): Promise<TaskEntity[]> {
    const { status, searchString }: SearchTaskDto = searchTaskDto;

    const query: SelectQueryBuilder<TaskEntity> =
      this.tasksRepository.createQueryBuilder('task');

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
    const found: TaskEntity = await this.tasksRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`Task with id '${id}' is not found`);
    }

    return found;
  }

  public async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description }: CreateTaskDto = createTaskDto;

    const newTask: TaskEntity = this.tasksRepository.create({
      title,
      description,
      status: EnTaskStatus.OPEN,
      user,
    });

    await this.tasksRepository.save(newTask);

    return newTask;
  }

  public async deleteTask(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  public async updateTaskStatus(
    id: string,
    status: EnTaskStatus,
  ): Promise<TaskEntity> {
    const foundTask: TaskEntity = await this.getTaskById(id);

    foundTask.status = status;

    await this.tasksRepository.save(foundTask);

    return foundTask;
  }
}
