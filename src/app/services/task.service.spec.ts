import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

describe('TaskService', () => {
  let service: TaskService;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    service = TestBed.inject(TaskService);
    expect(service).toBeTruthy();
  });

  it('should load initial tasks when a user is logged in', async () => {
    // 1. Sign up test user
    const signUpPromise = firstValueFrom(authService.signUp('test@example.com', 'password123', 'Test User'));
    const reqSignUp = httpMock.expectOne('http://localhost:8000/api/auth/register/');
    reqSignUp.flush({ id: 'user-1', email: 'test@example.com', fullName: 'Test User' });
    await signUpPromise;

    // 2. Login test user
    const loginPromise = firstValueFrom(authService.login('test@example.com', 'password123'));
    const reqLogin = httpMock.expectOne('http://localhost:8000/api/auth/login/');
    reqLogin.flush({
      token: 'token-abc',
      user: { id: 'user-1', email: 'test@example.com', fullName: 'Test User' }
    });
    await loginPromise;

    // 3. Resolve service synchronously (which triggers GET tasks/)
    service = TestBed.inject(TaskService);
    
    // Handle the tasks GET request triggered by constructor
    const reqTasks = httpMock.expectOne('http://localhost:8000/api/tasks/');
    expect(reqTasks.request.method).toBe('GET');
    reqTasks.flush([
      { id: '1', title: 'Task 1', description: 'desc', priority: 'High', dueDate: '2026-07-01', assignedTo: 'User', status: 'Todo', createdAt: '2026-07-01T12:00:00Z' }
    ]);

    const tasks = service.getAll();
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0].title).toBe('Task 1');
  });
});
