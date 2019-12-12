import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngresoEgreo } from './ingreso-egreso.model';

export interface IngresoEgresoState {
   items: IngresoEgreo[]
}

const estadoInicial: IngresoEgresoState = {
   items: []
}

export function ingresoEgresoRudecer(state = estadoInicial, action: fromIngresoEgreso.acciones): IngresoEgresoState {
   switch (action.type) {
      case fromIngresoEgreso.SET_ITEMS:
         return {
            items: [
               ...action.items.map(item => {
                  return {
                     ...item
                  }
               })
            ]
         };

      case fromIngresoEgreso.UNSET_ITEMS:
         return {
            items: []
         };

      default:
         return state;
   }
}