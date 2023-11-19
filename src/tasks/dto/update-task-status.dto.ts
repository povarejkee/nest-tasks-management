import { EnTaskStatus } from '../task.model';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(EnTaskStatus)
  public status: EnTaskStatus;
}
