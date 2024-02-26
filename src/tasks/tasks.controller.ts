import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskEntity } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getTasks(
    @Query() searchTaskDto: SearchTaskDto,
  ): Promise<TaskEntity[]> {
    return this.tasksService.getTasks(searchTaskDto);
  }

  @Get('/:id')
  public getTaskById(@Param('id') id: string): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  public createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  public deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskEntity> {
    const { status }: UpdateTaskStatusDto = updateTaskStatusDto;

    return this.tasksService.updateTaskStatus(id, status);
  }
}
