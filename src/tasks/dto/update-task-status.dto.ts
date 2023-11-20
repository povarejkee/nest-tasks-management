import { EnTaskStatus } from '../task-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(EnTaskStatus)
  public status: EnTaskStatus;
}
