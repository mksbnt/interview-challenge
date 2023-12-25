import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AverageSallaryPipe } from '../../pipes/average-sallary.pipe';
import { YoungestUserPipe } from '../../pipes/is-youngest-user.pipe';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../types/user.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    AverageSallaryPipe,
    YoungestUserPipe,
    ReactiveFormsModule,
  ],
  template: `
    <section>
      <h2>New user</h2>
      <form class="form" [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="name">Name:&nbsp;</label>
          <input
            #nameInput
            class="input"
            id="name"
            type="text"
            formControlName="name"
            autocomplete="off"
          />
        </div>
        <div class="field">
          <label for="age">Age:&nbsp;</label>
          <input
            class="input"
            id="age"
            type="number"
            formControlName="age"
            autocomplete="off"
            min="0"
          />
        </div>
        <div class="field">
          <label for="sallary">Sallary:&nbsp;</label>
          <input
            class="input"
            id="sallary"
            type="number"
            formControlName="sallary"
            autocomplete="off"
            min="0"
          />
        </div>
        <div class="field">
          <button class="button" type="submit" [disabled]="!userForm.valid">
            Add
          </button>
        </div>
      </form>
    </section>

    <section>
      <h2>List of users</h2>

      <ol>
        @for (user of users$ | async; track user.id) {
          <li
            [class.highlight]="user.age | isYoungestUser : youngestAge$ | async"
          >
            ID: {{ user.id }}, Name: {{ user.name }}, Age: {{ user.age }},
            Sallary: {{ user.sallary | currency }};
          </li>
          } @empty {
          <li>There are no users.</li>
        }
      </ol>

      <hr />

      @if (users$ | async) {
        <p class="average-sallary">
          Average Salary:
          {{ users$ | averageSallary | async | currency : 'USD' }}
        </p>
      }
    </section>
  `,
  styles: `
    .form {
      display: flex;
      flex-direction: column;
    
      .field {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;

        .input {
          width: 82%;
        }
      }

      .button {
        width: 100%;
      }
    }
    
    .highlight {  
      color: green;
    }

    .average-sallary {
      text-align: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  @Input({ required: true }) users!: User[];
  @ViewChild('nameInput') nameInputRef!: ElementRef<HTMLInputElement>
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);
  private usersCount!: number;
  youngestAge$!: Observable<number>;
  users$!: Observable<User[]>;
  userForm: FormGroup = this.formBuilder.group({
    name: [null, Validators.required],
    age: [null, Validators.required],
    sallary: [null, Validators.required],
  });

  ngOnInit(): void {
    this.users$ = of(this.users).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((users) => this.updateDerivedValues(users))
    );
  }

  onSubmit(): void {
    this.updateUsers(this.createUser());
    this.userForm.reset();
    this.nameInputRef.nativeElement.focus();
  }

  private createUser(): User {
    return {
      ...this.userForm.value,
      id: this.usersCount + 1,
    };
  }

  private updateUsers(newUser: User): void {
    this.users$ = this.users$.pipe(
      switchMap((users) =>
        of([...users, newUser]).pipe(
          tap((updatedUsers) => this.updateDerivedValues(updatedUsers))
        )
      )
    );
  }

  private updateDerivedValues(users: User[]): void {
    this.youngestAge$ = of(Math.min(...users.map((u) => u.age)));
    this.usersCount = users.length;
  }
}
