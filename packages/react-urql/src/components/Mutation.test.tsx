/* eslint-disable react-hooks/rules-of-hooks */

jest.mock('../context', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { delay, fromValue, pipe } = require('wonka');
  const mock = {
    executeMutation: jest.fn(() =>
      pipe(fromValue({ data: 1, error: 2 }), delay(200))
    ),
  };

  return {
    useClient: () => mock,
  };
});

import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { Mutation } from './Mutation';
import { useClient } from '../context';

// @ts-ignore
const client = useClient() as { executeMutation: jest.Mock };
const query = 'mutation Example { example }';

describe('Mutation', () => {
  beforeEach(() => {
    // TODO: Fix use of act()
    jest.spyOn(global.console, 'error').mockImplementation();
  });

  afterEach(() => {
    cleanup();
  });

  it('Should execute the mutation', done => {
    let execute = () => {
        /* noop */
      },
      props = {};
    const Test = () => <p>Hi</p>;
    const App = () => {
      return (
        // @ts-ignore
        <Mutation query={query}>
          {({ data, fetching, error, executeMutation }) => {
            execute = executeMutation;
            props = { data, fetching, error };
            return <Test />;
          }}
        </Mutation>
      );
    };
    render(<App />);
    expect(client.executeMutation).toBeCalledTimes(0);
    expect(props).toStrictEqual({
      data: undefined,
      fetching: false,
      error: undefined,
    });
    act(() => {
      execute();
    });
    expect(props).toStrictEqual({
      data: undefined,
      fetching: true,
      error: undefined,
    });
    setTimeout(() => {
      expect(props).toStrictEqual({ data: 1, fetching: false, error: 2 });
      done();
    }, 400);
  });
});
