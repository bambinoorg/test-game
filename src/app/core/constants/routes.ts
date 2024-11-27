import { IRoute } from '../models/application.model';

type AppRouting = 'game';

export const appRouts: Record<AppRouting, IRoute> = {
  game: { routerPath: 'game' },
};
