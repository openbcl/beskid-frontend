import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { auth } from '../store/auth.selector';
import { concatMap, take } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  return inject(Store).pipe(select(auth), take(1), concatMap(auth => {
    return !auth ? next(req) : next(req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.token}`
      }
    }))
  }));
};
