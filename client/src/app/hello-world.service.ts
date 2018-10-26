import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelloWorldService {

  private functionsUrl = `${environment.firebase.cloudFunctionsURL}/`;  // URL to cloud function

  constructor(private http: HttpClient) {
  }

  callHelloWorldFunction(): Observable<string> {
    return this.http.get<string>(this.functionsUrl + 'helloWorld/hello');
  }

  callHelloWorldSecureFunction(): Observable<string> {
    return this.http.get<string>(this.functionsUrl + 'helloWorldSecure/hello');
  }
}
