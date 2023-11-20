import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

// @EntityRepository(Task): Этот декоратор указывает, что TasksRepository является репозиторием для сущности Task.
// Он связывает этот репозиторий с конкретной сущностью базы данных.

// extends Repository<Task>: Класс TasksRepository расширяет базовый класс Repository из TypeORM и параметризован типом Task.
// Это означает, что TasksRepository предоставляет методы для выполнения
// операций базы данных (например, сохранение, поиск, обновление) для сущности Task.

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {}
