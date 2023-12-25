import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'isYoungestUser',
  standalone: true,
})
export class YoungestUserPipe implements PipeTransform {
  transform(
    userAge: number,
    youngestAge$: Observable<number>
  ): Observable<boolean> {
    return youngestAge$.pipe(map((youngestAge) => userAge === youngestAge));
  }
}
