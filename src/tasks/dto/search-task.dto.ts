import { EnTaskStatus } from '../task.model';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchTaskDto {
  @IsOptional()
  @IsNotEmpty()
  public searchString?: string;

  @IsOptional()
  @IsEnum(EnTaskStatus)
  public status?: EnTaskStatus;
}
