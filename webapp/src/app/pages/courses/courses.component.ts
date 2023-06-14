import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as CourseAction from 'src/app/pages/courses/state/course.actions';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/Course';
import { CourseImp } from 'src/app/models/CourseImp';
import { CourseService } from 'src/app/services/course.service';
import { TopicChannelService } from 'src/app/services/topic-channel.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { getCourseSelected, State } from 'src/app/state/app.reducer';
import {
  getChannelSelected,
  getCurrentCourse,
  getCurrentCourseId,
  getIsTagSelected,
} from './state/course.reducer';
import * as CourseActions from 'src/app/pages/courses/state/course.actions';
import { Location } from '@angular/common';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Notification } from 'src/app/models/Notification';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class CoursesComponent implements OnInit {
  selectedCourse: Course = new CourseImp('', '');
  courseSelected$: Observable<boolean>;
  tagSelected$: Observable<boolean>;
  course: Course;
  createdAt: string;
  firstName: string;
  lastName: string;
  ChannelToggel: boolean = false;
  Users: any;
  userArray: any = new Array();
  channelSelected$: Observable<boolean>;
  courseId: string;
  moderator: boolean = false;
  notification$: Observable<Notification>;
  isNavigatingToNotificationContextThroughCourseComponent$: Observable<boolean>;
  constructor(
    protected courseService: CourseService,
    private topicChannelService: TopicChannelService,
    private store: Store<State>,
    private userService: UserServiceService,
    private confirmationService: ConfirmationService,
    private renderer: Renderer2,
    private router: Router,
    private messageService: MessageService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('running the courses component callback!');
        if (courseService.navigatingToMaterial) {
          console.log('navigating to video');
          let notification = { ...courseService.Notification };
          courseService.navigatingToMaterial = false;
          courseService.Notification = null;
          /*           this.router.navigateByUrl(
            '/course/' +
              notification.course_id +
              '/channel/' +
              notification.channel_id +
              '/material/' +
              '(material:' +
              notification.material_id +
              '/video)'
          ); */
          this.reloadCurrentRoute();
        }
      }
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        if (!url.includes('tag')) {
          this.store.dispatch(CourseActions.selectTag({ tagSelected: false }));
          this.tagSelected$ = this.store.select(getIsTagSelected);
        }
      }
    });
    this.courseSelected$ = store.select(getCourseSelected);
    this.channelSelected$ = this.store.select(getChannelSelected);
  }

  ngOnInit(): void {
    this.ChannelToggel = false;
    this.courseService.onSelectCourse.subscribe((course) => {
      this.ChannelToggel = false;
    });

    /*     this.selectedCourse = this.courseService.getSelectedCourse();
this.ChannelToggel = false;
this.Users = [];
    this.courseService.onSelectCourse.subscribe((course) => {
      this.selectedCourse = course;

      this.ChannelToggel = false;
      this.topicChannelService.fetchTopics(course._id).subscribe((course) => {
        this.selectedCourse = course;
        this.Users = course.users;
        let userModerator = this.Users.find(
          (user) => user.role.name === 'moderator'
        );

        this.buildCardInfo(userModerator.userId, course);
      });
      if (this.selectedCourse.role === 'moderator') {
        this.moderator = true;
      } else {
        this.moderator = false;
      }
    }); */
  }
  /*   buildCardInfo(userModeratorID: string, course: Course) {
    this.userService.GetUserName(userModeratorID).subscribe((user) => {
      this.firstName = user.firstname;
      this.lastName = user.lastname;

      var index = course.createdAt.indexOf('T');
      (this.createdAt = course.createdAt.slice(0, index)),
        course.createdAt.slice(index + 1);
      let ingoPush = {
        id: course._id,
        name: course.name,
        shortName: course.shortName,
        createdAt: this.createdAt,
        firstName: this.firstName,
        lastName: this.lastName,
      };
      this.userArray.push(ingoPush);
    });
  }
  getName(firstName: string, lastName: string) {
    let Name = firstName + ' ' + lastName;
    return Name.split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
  deEnrole() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to Un Enroll from course"' +
        this.selectedCourse.name +
        '"?',
      header: 'Un-Enroll Confirmation',
      icon: 'pi pi-info-circle',
      accept: (e) => this.unEnrolleCourse(this.selectedCourse),

      reject: () => {
        // this.informUser('info', 'Cancelled', 'Deletion cancelled')
      },
    });
    setTimeout(() => {
      const rejectButton = document.getElementsByClassName(
        'p-confirm-dialog-reject'
      ) as HTMLCollectionOf<HTMLElement>;
      for (var i = 0; i < rejectButton.length; i++) {
        this.renderer.addClass(rejectButton[i], 'p-button-outlined');
      }
    }, 0);
  }
  unEnrolleCourse(course: Course) {
    this.courseService.WithdrawFromCourse(course).subscribe((res) => {
      if ('success' in res) {
        this.showInfo('You have been  withdrewed successfully ');

        this.store.dispatch(
          CourseAction.setCurrentCourse({ selcetedCourse: course })
        );
        this.router.navigate(['course-description', course._id]);
      }
      (er) => {
        console.log(er);
        alert(er.error.error);
        this.showError('Please make sure to add a valid data!');
      };
    });
  }

  showInfo(msg) {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: msg,
    });
  }

  showError(msg) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: msg,
    });
  } */

  NowClicked() {
    this.ChannelToggel = true;
  }

  reloadCurrentRoute() {
    console.log('reloading the current route');
    console.log(this.router.url);
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
}
