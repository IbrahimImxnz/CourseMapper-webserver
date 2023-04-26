import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Annotation } from 'src/app/models/Annotations';
import { State } from 'src/app/state/app.reducer';
import { getAnnotationsForSelectedTag } from '../../../courses/state/course.reducer';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as CourseActions from 'src/app/pages/courses/state/course.actions'

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.component.html',
  styleUrls: ['./tags-page.component.css']
})
export class TagsPageComponent {
  annotationsForTag: Annotation[];
  courseId: string;
  hashTagName: string;

  constructor(private store: Store<State>, private router: Router,){
      const url = this.router.url;
      if (url.includes('tag')){
        this.courseId = url.match(/\/course\/([\w\d]+)\//)[1];
         this.hashTagName = decodeURIComponent(url.match(/\/tag\/(.+)/)[1]);
        this.store.dispatch(CourseActions.loadAnnotationsForSelectedTag({tagSelected: true, selectedTagName: this.hashTagName, courseId: this.courseId}));
      }
    this.store.select(getAnnotationsForSelectedTag).subscribe((annotations) => this.annotationsForTag = annotations);
  }

}
