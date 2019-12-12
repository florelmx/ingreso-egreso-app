import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
// import { AppState } from 'src/app/app.reducer';
import { IngresoEgreo } from '../ingreso-egreso.model';
import { Label, MultiDataSet } from 'ng2-charts';

import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

@Component({
   selector: 'app-estadistica',
   templateUrl: './estadistica.component.html',
   styles: []
})
export class EstadisticaComponent implements OnInit, OnDestroy {
   ingresos: number;
   egresos: number;

   cuantosIngresos: number;
   cuantosEgresos: number;

   subscription: Subscription = new Subscription();

   public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
   public doughnutChartData: MultiDataSet = [];

   constructor(
      private store: Store<fromIngresoEgreso.AppState>
   ) { }

   ngOnInit() {
      this.subscription = this.store.select('ingresoEgreso')
         .subscribe(ingresoEgreso => {
            this.contarIngresoEgreso(ingresoEgreso.items);
         })
   }

   contarIngresoEgreso(items: IngresoEgreo[]) {
      this.cuantosIngresos = 0;
      this.cuantosEgresos = 0;

      this.ingresos = 0;
      this.egresos = 0;

      items.forEach(item => {
         if (item.tipo === 'ingreso') {
            this.cuantosIngresos++;
            this.ingresos += item.monto;
         } else {
            this.cuantosEgresos++;
            this.egresos += item.monto;
         }
      })

      this.doughnutChartData = [[this.ingresos, this.egresos]];
   }

   ngOnDestroy(){
      this.subscription.unsubscribe()
   }

}
