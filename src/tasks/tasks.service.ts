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
  public async getTasks(
    searchTaskDto: SearchTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { status, searchString }: SearchTaskDto = searchTaskDto;

    const query: SelectQueryBuilder<TaskEntity> =
      this.tasksRepository.createQueryBuilder('task');

    // этот код означает, что будут забираться таски только по текущему юзеру.
    // если убрать, то будут приходить все таски:
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (searchString) {
      const queryCondition: string =
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))';

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

  public async getTaskById(id: string, user: UserEntity): Promise<TaskEntity> {
    const found: TaskEntity = await this.tasksRepository.findOne({
      where: { id, user },
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

  public async deleteTask(id: string, user: UserEntity): Promise<void> {
    await this.tasksRepository.delete({ id, user });
  }

  public async updateTaskStatus(
    id: string,
    status: EnTaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const foundTask: TaskEntity = await this.getTaskById(id, user);

    foundTask.status = status;

    await this.tasksRepository.save(foundTask);

    return foundTask;
  }
}
