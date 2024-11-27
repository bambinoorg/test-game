import { Routes } from '@angular/router';
import { appRouts } from './core/constants/routes';

export const routes: Routes = [
  {
    path: appRouts.game.routerPath,
    loadChildren: () =>
      import('./pages/game-page/game-page.module').then(e => e.GamePageModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/game-page/game-page.module').then(e => e.GamePageModule),
  },
];
