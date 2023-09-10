import { createStore } from 'jotai';
import { drawerStatusAtom } from './drawer';
import { initialUserState, userAtom } from './user';

export const appStore = createStore();

appStore.set(drawerStatusAtom, false);
appStore.set(userAtom, initialUserState);
