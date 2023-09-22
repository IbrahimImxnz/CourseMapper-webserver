import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'src/app/services/notifications.service';
import { State } from '../state/notifications.reducer';
import * as NotificationActions from '../state/notifications.actions';
import { getAllNotificationsNumUnread } from '../state/notifications.reducer';
import { Observable } from 'rxjs';
import { getShowNotificationsPanel } from 'src/app/state/app.reducer';
import { OverlayPanel } from 'primeng/overlaypanel';
import * as AppActions from 'src/app/state/app.actions';
//TODO: put this component behind an Auth guard
@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css'],
})
export class NotificationBellComponent {
  constructor(
    private notificationsService: NotificationsService,
    private store: Store<State>
  ) {}

  @ViewChild('notificationPanel') notificationPanel: OverlayPanel;
  totalNumUnreadNotifications$: Observable<number>;
  showNotificationsPanel$: Observable<boolean>;

  //TODO Move the loadNotifications dispatch action and the initialiseSocketConnection method to the app.component.ts or somewhere else.
  ngOnInit(): void {
    this.showNotificationsPanel$ = this.store.select(getShowNotificationsPanel);
    this.showNotificationsPanel$.subscribe((showNotificationsPanel) => {
      console.log('showNotificationsPanel', showNotificationsPanel);
      console.log('SUBSCRIPTION RUNNING!!!!');
      if (showNotificationsPanel === false && this.notificationPanel) {
        this.notificationPanel.hide();
      }
    });
    this.store.dispatch(NotificationActions.loadNotifications());
    this.notificationsService.initialiseSocketConnection();
    this.totalNumUnreadNotifications$ = this.store.select(
      getAllNotificationsNumUnread
    );
  }

  toggleNotificationPanel($event: any, notificationPanel: any) {
    notificationPanel.show($event);
    this.store.dispatch(
      AppActions.setShowNotificationsPanel({ showNotificationsPanel: true })
    );
  }
}
