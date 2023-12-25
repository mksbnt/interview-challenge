import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TaskComponent } from './components/task/task.component';
import { UsersComponent } from './components/users/users.component';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/types/user.type';

function getTitle(): Promise<string> {
  return Promise.resolve('Angular interview challenge');
}

function getTasks(): Promise<string[]> {
  return Promise.resolve([
    'Show List of users',
    'Show Average sallary',
    'Highlight youngest user',
    'User form submit should add user',
  ]);
}

function getUsers(): Promise<User[]> {
  return Promise.resolve([
    { id: 1, name: 'User 1', age: 23, sallary: 1000 },
    { id: 2, name: 'User 2', age: 40, sallary: 2000 },
    { id: 3, name: 'User 3', age: 32, sallary: 500 },
    { id: 4, name: 'User 4', age: 23, sallary: 1500 },
  ]);
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskComponent, UsersComponent],
  template: `
    <main>
      <app-task [title]="title" [tasks]="tasks"></app-task>
      <app-users *ngIf="users" [users]="users"></app-users>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit {
  title!: string;
  tasks!: string[];
  users!: User[];

  async ngOnInit(): Promise<void> {
    this.title = await getTitle();
    this.tasks = await getTasks();
    this.users = await getUsers();
  }
}
