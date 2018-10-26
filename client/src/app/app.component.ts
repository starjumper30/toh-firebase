import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { HelloWorldService } from './hello-world.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';

  greeting: Observable<string>;

  constructor(readonly afAuth: AngularFireAuth, private helloSvc: HelloWorldService) {
    this.greeting = this.afAuth.authState
      .pipe(
        filter(u => !!u),
        switchMap(() => this.helloSvc.callHelloWorldSecureFunction())
      );
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
