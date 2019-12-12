import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreo } from './ingreso-egreso.model';

@Pipe({
   name: 'ordenIngresoEgreso'
})
export class OrdenIngresoEgresoPipe implements PipeTransform {

   transform(items: IngresoEgreo[]): IngresoEgreo[] {
      return items.sort((a, b) => {
         if (a.tipo === 'ingreso') {
            return -1;
         } else {
            return 1
         }
      });
   }

}
