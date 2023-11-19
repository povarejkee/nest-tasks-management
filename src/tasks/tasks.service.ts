import { Injectable, NotFoundException } from '@nestjs/common';
import { EnTaskStatus, ITask } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  public getTasks(): ITask[] {
    return this.tasks;
  }

  public getFilteredTasks(searchTaskDto: SearchTaskDto): ITask[] {
    const { status, searchString }: SearchTaskDto = searchTaskDto;

    let filteredTasks: ITask[] = this.getTasks();

    if (status) {
      filteredTasks = filteredTasks.filter(
        (task: ITask): boolean => task.status === status,
      );
    }

    if (searchString) {
      filteredTasks = filteredTasks.filter((task: ITask): boolean => {
        const isInTitle: boolean = task.title.includes(searchString);
        const isInDescription: boolean =
          task.description.includes(searchString);

        return isInTitle || isInDescription;
      });
    }

    return filteredTasks;
  }

  public getTaskById(id: string): ITask {
    const found: ITask = this.tasks.find(
      (task: ITask): boolean => task.id === id,
    );

    if (!found) {
      throw new NotFoundException(`Task with id '${id}' is not found`);
    }

    return found;
  }

  public createTask(createTaskDto: CreateTaskDto): ITask {
    const { title, description }: CreateTaskDto = createTaskDto;

    const newTask: ITask = {
      id: uuid(),
      title,
      description,
      status: EnTaskStatus.OPEN,
    };

    this.tasks.push(newTask);

    return newTask;
  }

  public deleteTask(id: string): void {
    const found: ITask = this.getTaskById(id);

    this.tasks = this.tasks.filter(
      (task: ITask): boolean => task.id !== found.id,
    );
  }

  public updateTaskStatus(id: string, status: EnTaskStatus): ITask {
    const foundTask: ITask = this.getTaskById(id);

    foundTask.status = status;

    return foundTask;
  }
}
