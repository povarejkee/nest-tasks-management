import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getTasks(@Query() searchTaskDto: SearchTaskDto): ITask[] {
    const areNoSearchParams: boolean =
      Object.values(searchTaskDto).length === 0;

    if (areNoSearchParams) {
      return this.tasksService.getTasks();
    } else {
      return this.tasksService.getFilteredTasks(searchTaskDto);
    }
  }

  @Get('/:id')
  public getTaskById(@Param('id') id: string): ITask {
    return this.tasksService.getTaskById(id);
  }

  // @UsePipes(ValidationPipe)
  // @Body(ValidationPipe) createTaskDto: CreateTaskDto
  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDto): ITask {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  public deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): ITask {
    const { status }: UpdateTaskStatusDto = updateTaskStatusDto;

    return this.tasksService.updateTaskStatus(id, status);
  }
}
