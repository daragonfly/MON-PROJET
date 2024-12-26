import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private scoreUpdatedSource = new Subject<void>();
  scoreUpdated$ = this.scoreUpdatedSource.asObservable();

  announceScoreUpdated() {
    this.scoreUpdatedSource.next();
  }
}
