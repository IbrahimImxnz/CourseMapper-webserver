import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AUTH_API, AUTH_API_2, HTTPOptions } from '../config/config';

import { User } from '../models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  public resu: any;
  firstname!: string;
  user: User;
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API_2 + 'signin',
      { username, password },
      HTTPOptions
    );
  }

  register(
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http
      .post(
        AUTH_API_2 + 'signup',
        { firstname, lastname, username, email, password },
        HTTPOptions
      )
      .pipe(
        tap((res: { id?: string; success?: string }) => {
          //
          this.resu = res.id;

          this.register_2(this.resu, username, email, password);
        })
      );
  }

  register_2(_id: string, username: string, email: string, password: string) {
    this.http
      .post<any>(AUTH_API_2 + 'signup', { _id, username, email, password })
      .subscribe((res) => {
        //
      });
  }

  logout(): Observable<any> {
    this.setlastTimeCourseMapperOpened().subscribe();
    return this.http.post(AUTH_API_2 + 'signout', {}, HTTPOptions);
  }

  GetUserName(_id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/users/${_id}`).pipe(
      tap((user) => {
        this.user = user;
      })
    );
  }

  setlastTimeCourseMapperOpened() {
    return this.http.put(`${this.API_URL}/user/lastTimeCourseMapperOpened`, {});
  }

  getlastTimeCourseMapperOpened() {
    return this.http.get<{ lastTimeCourseMapperOpened: string }>(
      `${this.API_URL}/user/lastTimeCourseMapperOpened`
    );
  }
}
