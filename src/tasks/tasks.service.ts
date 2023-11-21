import { Injectable, NotFoundException } from '@nestjs/common';
import { EnTaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    // @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
    private entityManager: EntityManager,
  ) {}
  // private tasks: ITask[] = [];
  // public getTasks(): ITask[] {
  //   return this.tasks;
  // }
  // public getFilteredTasks(searchTaskDto: SearchTaskDto): ITask[] {
  //   const { status, searchString }: SearchTaskDto = searchTaskDto;
  //
  //   let filteredTasks: ITask[] = this.getTasks();
  //
  //   if (status) {
  //     filteredTasks = filteredTasks.filter(
  //       (task: ITask): boolean => task.status === status,
  //     );
  //   }
  //
  //   if (searchString) {
  //     filteredTasks = filteredTasks.filter((task: ITask): boolean => {
  //       const isInTitle: boolean = task.title.includes(searchString);
  //       const isInDescription: boolean =
  //         task.description.includes(searchString);
  //
  //       return isInTitle || isInDescription;
  //     });
  //   }
  //
  //   return filteredTasks;
  // }

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

  // public getTaskById(id: string): ITask {
  //   const found: ITask = this.tasks.find(
  //     (task: ITask): boolean => task.id === id,
  //   );
  //
  //   if (!found) {
  //     throw new NotFoundException(`Task with id '${id}' is not found`);
  //   }
  //
  //   return found;
  // }
  // public createTask(createTaskDto: CreateTaskDto): ITask {
  //   const { title, description }: CreateTaskDto = createTaskDto;
  //
  //   const newTask: ITask = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: EnTaskStatus.OPEN,
  //   };
  //
  //   this.tasks.push(newTask);
  //
  //   return newTask;
  // }
  // public deleteTask(id: string): void {
  //   const found: ITask = this.getTaskById(id);
  //
  //   this.tasks = this.tasks.filter(
  //     (task: ITask): boolean => task.id !== found.id,
  //   );
  // }
  // public updateTaskStatus(id: string, status: EnTaskStatus): ITask {
  //   const foundTask: ITask = this.getTaskById(id);
  //
  //   foundTask.status = status;
  //
  //   return foundTask;
  // }
}
