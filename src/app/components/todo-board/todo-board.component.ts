import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, map } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { Task, TaskDraft, TaskStatus } from '../../models/task.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { CreateTaskFormComponent } from '../create-task-form/create-task-form.component';
import { TaskCardComponent } from '../task-card/task-card.component';

interface BoardColumn {
  status: TaskStatus;
  label: string;
}

@Component({
  selector: 'app-todo-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    NavbarComponent,
    CreateTaskFormComponent,
    TaskCardComponent,
  ],
  templateUrl: './todo-board.component.html',
})
export class TodoBoardComponent implements OnInit {
  columns: BoardColumn[] = [
    { status: 'Todo', label: 'Todo' },
    { status: 'In Progress', label: 'In Progress' },
    { status: 'Done', label: 'Done' },
  ];

  tasks$!: Observable<Task[]>;

  formVisible = false;
  taskBeingEdited: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.tasks$;
  }

  tasksFor(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(map((tasks) => tasks.filter((t) => t.status === status)));
  }

  openCreateForm(): void {
    this.taskBeingEdited = null;
    this.formVisible = true;
  }

  openEditForm(task: Task): void {
    this.taskBeingEdited = task;
    this.formVisible = true;
  }

  closeForm(): void {
    this.formVisible = false;
    this.taskBeingEdited = null;
  }

  handleSubmit(draft: TaskDraft): void {
    if (this.taskBeingEdited) {
      this.taskService.update(this.taskBeingEdited.id, draft);
    } else {
      this.taskService.create(draft);
    }
    this.closeForm();
  }

  handleDelete(task: Task): void {
    if (confirm(`Delete task "${task.title}"?`)) {
      this.taskService.delete(task.id);
    }
  }

  handleStart(task: Task): void {
    this.taskService.moveToInProgress(task.id);
  }

  handleDone(task: Task): void {
    this.taskService.moveToDone(task.id);
  }

  drop(event: CdkDragDrop<TaskStatus>): void {
    if (event.previousContainer !== event.container) {
      const task = event.item.data as Task;
      const newStatus = event.container.id as TaskStatus;
      this.taskService.setStatus(task.id, newStatus);
    }
  }
}
