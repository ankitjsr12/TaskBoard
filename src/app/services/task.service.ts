import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, of } from 'rxjs';
import { Task, TaskDraft, TaskStatus } from '../models/task.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'task-board.tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  readonly tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  private readonly API_URL = `${environment.apiUrl}/tasks/`;

  constructor() {
    // Reactively refresh tasks whenever the logged-in user changes
    this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (user) {
          return this.fetchTasks();
        } else {
          return of([]);
        }
      })
    ).subscribe((tasks) => this.tasksSubject.next(tasks));
  }

  private fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL);
  }

  getAll(): Task[] {
    return this.tasksSubject.value;
  }

  create(draft: TaskDraft): void {
    this.http.post<Task>(this.API_URL, draft).subscribe({
      next: (newTask) => {
        this.tasksSubject.next([newTask, ...this.tasksSubject.value]);
      },
      error: (err) => console.error('Failed to create task', err),
    });
  }

  update(id: string, changes: Partial<TaskDraft>): void {
    this.http.patch<Task>(`${this.API_URL}${id}/`, changes).subscribe({
      next: (updatedTask) => {
        const updatedList = this.tasksSubject.value.map((t) =>
          t.id === id ? updatedTask : t
        );
        this.tasksSubject.next(updatedList);
      },
      error: (err) => console.error('Failed to update task', err),
    });
  }

  delete(id: string): void {
    this.http.delete(`${this.API_URL}${id}/`).subscribe({
      next: () => {
        this.tasksSubject.next(this.tasksSubject.value.filter((t) => t.id !== id));
      },
      error: (err) => console.error('Failed to delete task', err),
    });
  }

  moveToInProgress(id: string): void {
    this.setStatus(id, 'In Progress');
  }

  moveToDone(id: string): void {
    this.setStatus(id, 'Done');
  }

  setStatus(id: string, status: TaskStatus): void {
    this.update(id, { status } as any);
  }
}
