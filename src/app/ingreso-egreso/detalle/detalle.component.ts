import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreo } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

@Component({
   selector: 'app-detalle',
   templateUrl: './detalle.component.html',
   styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

   items: IngresoEgreo[]
   subscription: Subscription = new Subscription();

   constructor(
      private store: Store<fromIngresoEgreso.AppState>,
      public ingresoEgresoService: IngresoEgresoService
   ) { }

   ngOnInit() {
      this.subscription = this.store.select('ingresoEgreso')
         .subscribe(ingresoEgreso => {
            this.items = ingresoEgreso.items;
         })
   }

   ngOnDestroy() {
      this.subscription.unsubscribe();
   }

   borrarItem(item: IngresoEgreo) {
      this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
      .then( ()=>{
         Swal.fire('Item eliminado', item.descripcion, 'success')
      });
   }

}
