import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import * as firebase from 'firebase'
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators'

import Swal from 'sweetalert2'
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accion';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';



@Injectable({
   providedIn: 'root'
})
export class AuthService {

   private userSubscription : Subscription = new Subscription()

   constructor(
      private afAuth: AngularFireAuth,
      private router: Router,
      private afDB: AngularFirestore,
      private store: Store<AppState>
   ) { }

   initAuthListener() {
      this.afAuth.authState.subscribe((fbUser: firebase.User) => {
         if (fbUser) {
            this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
               .subscribe((usaurioObj: any) => {
                  const newUser = new User(usaurioObj)
                  this.store.dispatch(new SetUserAction(newUser))
                  console.log(newUser)
               })
         } else {
            this.userSubscription.unsubscribe()
         }
      })
   }

   crearUsuario(nombre: string, email: string, password: string) {

      this.store.dispatch(new ActivarLoadingAction())

      this.afAuth.auth
         .createUserWithEmailAndPassword(email, password)
         .then(resp => {
            // console.log(resp)
            const user: User = {
               uid: resp.user.uid,
               nombre: nombre,
               email: resp.user.email
            }

            this.afDB.doc(`${user.uid}/usuario`)
               .set(user)
               .then(() => {
                  this.router.navigate(['/'])
                  this.store.dispatch(new ActivarLoadingAction())
               })


         })
         .catch(error => {
            this.store.dispatch(new ActivarLoadingAction())
            console.error(error)
            Swal.fire({ title: 'Error en el login', text: error.message, type: 'error' });
         })
   }

   login(email: string, password: string) {
      this.store.dispatch(new ActivarLoadingAction())
      this.afAuth.auth
         .signInWithEmailAndPassword(email, password)
         .then(resp => {
            // console.log(resp)
            this.router.navigate(['/'])
            this.store.dispatch(new ActivarLoadingAction())
         })
         .catch(error => {
            // console.error(error);
            this.store.dispatch(new ActivarLoadingAction())
            Swal.fire({ title: 'Error en el login', text: error.message, type: 'error' });
         })
   }

   logout() {
      this.router.navigate(['/login']);
      this.afAuth.auth.signOut()
   }

   isAuth() {
      return this.afAuth.authState.pipe(
         map(fbUser => {
            if (fbUser == null) {
               this.router.navigate(['/login'])
            }
            return fbUser != null
         })
      )
   }
}
