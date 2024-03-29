import { createContext } from 'react';
import createHistory from 'history/createHashHistory';

const history = createHistory();

export const { Provider, Consumer } = createContext({
  user: null,
  history: history,
  login: () => {},
  logout: () => {},
  unsubscribeNews: () => {},
  ticketSubmit: () => {},
  convDbString: () => {},
  prompt: () => {}
});
