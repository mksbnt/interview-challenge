import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { User } from '../types/user.type';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'averageSallary',
  standalone: true,
})
@Injectable()
export class AverageSallaryPipe implements PipeTransform {
  transform(users$: Observable<User[]>): Observable<number> {
    return users$.pipe(
      map((users) => {
        return (
          users.reduce((acc, user) => acc + user.sallary, 0) / users.length
        );
      })
    );
  }
}
