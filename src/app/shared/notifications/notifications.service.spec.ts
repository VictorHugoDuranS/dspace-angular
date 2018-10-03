import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsBoardComponent } from './notifications-board/notifications-board.component';
import { NotificationComponent } from './notification/notification.component';
import { Store, StoreModule } from '@ngrx/store';
import { notificationsReducer } from './notifications.reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NewNotificationAction, RemoveAllNotificationsAction, RemoveNotificationAction } from './notifications.actions';
import { Notification } from './models/notification.model';
import { NotificationType } from './models/notification-type';
import { GlobalConfig } from '../../../config/global-config.interface';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockTranslateLoader } from '../mocks/mock-translate-loader';
import { GLOBAL_CONFIG } from '../../../config';

describe('NotificationsService test', () => {
  const store: Store<Notification> = jasmine.createSpyObj('store', {
    dispatch: {},
    select: Observable.of(true)
  });
  let service: NotificationsService;
  let envConfig: GlobalConfig;

  envConfig = {
    notifications: {
      rtl: false,
      position: ['top', 'right'],
      maxStack: 8,
      timeOut: 5000,
      clickToClose: true,
      animate: 'scale'
    },
  } as any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({notificationsReducer}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [NotificationComponent, NotificationsBoardComponent],
      providers: [
        { provide: GLOBAL_CONFIG, useValue: envConfig },
        { provide: Store, useValue: store },
        NotificationsService,
        TranslateService
      ]
    });

    service = TestBed.get(NotificationsService);
  });

  it('Success method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.success('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Success);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Warning method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.warning('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Warning);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Info method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.info('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Info);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Error method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.error('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Error);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Remove method should dispatch RemoveNotificationAction with proper id', () => {
    const notification = new Notification('1234', NotificationType.Info, 'title...', 'description');
    service.remove(notification);
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveNotificationAction(notification.id));
  });

  it('RemoveAll method should dispatch RemoveAllNotificationsAction', () => {
    service.removeAll();
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllNotificationsAction());
  });

});
