import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AppComponent } from './app.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StoreMock } from './testing/mocks';
import { ConfirmationService, MessageService } from 'primeng/api';


describe('AppComponent', () => {
  let actions$: Observable<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideMockActions(() => actions$), {
          provide: Store,
          useValue: StoreMock
        },
        { provide: ConfirmationService },
        { provide: MessageService },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
