import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign up a user successfully', async () => {
    const mockUser = { id: '1', email: 'new@example.com', fullName: 'New User', passwordHash: 'pwd' };
    
    const promise = firstValueFrom(service.signUp('new@example.com', 'password', 'New User'));
    
    const req = httpMock.expectOne('http://localhost:8000/api/auth/register/');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);

    const user = await promise;
    expect(user.email).toBe('new@example.com');
    expect(user.fullName).toBe('New User');
  });

  it('should login successfully with correct credentials', async () => {
    const mockLoginRes = {
      token: 'jwt-access-token',
      user: { id: '1', email: 'login@example.com', fullName: 'Login User', passwordHash: 'pwd' }
    };

    const promise = firstValueFrom(service.login('login@example.com', 'password'));

    const req = httpMock.expectOne('http://localhost:8000/api/auth/login/');
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginRes);

    const res = await promise;
    expect(res.user.email).toBe('login@example.com');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should logout correctly', async () => {
    const mockLoginRes = {
      token: 'jwt-access-token',
      user: { id: '1', email: 'logout@example.com', fullName: 'Logout User', passwordHash: 'pwd' }
    };

    const promise = firstValueFrom(service.login('logout@example.com', 'password'));

    const req = httpMock.expectOne('http://localhost:8000/api/auth/login/');
    req.flush(mockLoginRes);
    await promise;

    expect(service.isAuthenticated()).toBe(true);
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });
});
