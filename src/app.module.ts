import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TasksModule,
    // настройки подключения db:
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task-management',

      // Когда установлено значение true, TypeORM автоматически обнаруживает и загружает файлы сущностей,
      // позволяя использовать декораторы, такие как @Entity(), для определения сущностей базы данных:
      autoLoadEntities: true,

      // Когда установлено значение true, TypeORM автоматически создает таблицы базы данных на основе ваших классов сущностей.
      // Обычно используется в разработке, но в производстве следует установить значение false,
      // чтобы предотвратить непреднамеренные изменения схемы базы данных.
      // В производственной среде рекомендуется установить synchronize в false и управлять миграциями схемы базы данных более явно.
      synchronize: true,
    }),
  ],
})
export class AppModule {}
