import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreo } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class IngresoEgresoService {

   ingresoEgresoListerSubcription: Subscription = new Subscription();
   ingresoEgresoItemsSubcription: Subscription = new Subscription();

   constructor(
      private afDB: AngularFirestore,
      public authService: AuthService,
      private store: Store<AppState>
   ) { }

   initIngresoEgresoListener() {
      this.ingresoEgresoListerSubcription = this.store.select('auth')
         .pipe(
            filter(auth => auth.user != null)
         )
         .subscribe(auth => {
            this.ingresoEgresoItems(auth.user.uid)
         });
   }

   private ingresoEgresoItems(uid: string) {
      this.ingresoEgresoItemsSubcription = this.afDB.collection(`${uid}/ingresos-egresos/items`)
         .snapshotChanges()
         .pipe(
            map(docData => {
               return docData.map(doc => {
                  return {
                     ...doc.payload.doc.data(),
                     uid: doc.payload.doc.id
                  }
               })
            })
         )
         .subscribe((coleccion: any[]) => {
            this.store.dispatch(new SetItemsAction(coleccion));
         })
   }

   cancelarSubcription() {
      this.ingresoEgresoListerSubcription.unsubscribe();
      this.ingresoEgresoItemsSubcription.unsubscribe();
      this.store.dispatch(new UnsetItemsAction());
   }

   crearIngresoEgreso(ingresoEgreso: IngresoEgreo) {
      const user = this.authService.getUsuario();
      return this.afDB.doc(`${user.uid}/ingresos-egresos`)
         .collection('items').add({ ...ingresoEgreso })
   }

   borrarIngresoEgreso(uid: string){
      const user = this.authService.getUsuario();

      return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`)
      .delete();
   }


}
