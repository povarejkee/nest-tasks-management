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
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity[]> {
    return this.tasksService.getTasks(searchTaskDto, user);
  }

  @Get('/:id')
  public getTaskById(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  public createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity, // нужен для того, чтобы связать добавляемую таску именно с тем юзером, который сейчас ее добавляет
  ): Promise<TaskEntity> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  public deleteTask(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    const { status }: UpdateTaskStatusDto = updateTaskStatusDto;

    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
