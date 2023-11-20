import { EnTaskStatus } from '../task-status.enum';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchTaskDto {
  @IsOptional()
  @IsNotEmpty()
  public searchString?: string;

  @IsOptional()
  @IsEnum(EnTaskStatus)
  public status?: EnTaskStatus;
}
