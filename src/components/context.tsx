import createContext from 'create-react-context';
import { Client } from '../lib/client';

// We assume some default options here; mainly not to actually be used
// but not to error catastrophically if someone is just playing around
const defaultOptions = { url: '/graphql' };

export const Context = createContext<Client>(new Client(defaultOptions));
export const Provider = Context.Provider;
export const Consumer = Context.Consumer;
