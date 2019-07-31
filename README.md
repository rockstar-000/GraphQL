# @urql/exchange-suspense

`@urql/exchange-suspense` is an exchange for the [`urql`](https://github.com/FormidableLabs/urql) GraphQL client that allows the use of React Suspense on the client-side with `urql`'s built-in suspense mode.

`urql` already supports suspense today, but it's typically used to implement prefetching
during server-side rendering with `react-ssr-prepass`, which allows it to execute React
suspense on the server.
But since `<Suspense>` is mainly intended for client-side use it made sense to build and publish
this exchange, which allows you to try out `urql` and suspense in your React app!

> ⚠️ Note: React's Suspense feature is currently unstable and may still change.
> This exchange is experimental and demonstrates how `urql` already supports and
> interacts with client-side suspense and how it may behave in the future, when React
> Suspense ships and becomes stable. You may use it, but do so at your own risk!

## Quick Start Guide

First install `@urql/exchange-suspense` alongside `urql`:

```sh
yarn add @urql/exchange-suspense
# or
npm install --save @urql/exchange-suspense
```

You'll then need to add the `suspenseExchange`, that this package exposes, to your
`urql` Client and set the `suspense` mode to `true`:

```js
import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from 'urql';
import { suspenseExchange } from '@urql/exchange-suspense';

const client = createClient({
  url: 'http://localhost:1234/graphql',
  suspense: true, // Enable suspense mode
  exchanges: [
    dedupExchange,
    suspenseExchange, // Add suspenseExchange to your urql exchanges
    cacheExchange,
    fetchExchange,
  ],
});
```

**Important:**
In React Suspense when a piece of data is still loading, a promise will
be thrown that tells React to wait for this promise to complete and try rendering the
suspended component again. The `suspenseExchange` works by caching
the result of any operation until React retries, but it doesn't replace the
`cacheExchange`, since it only briefly keeps the result around.

This means that, in your array of Exchanges, the `suspenseExchange` should be
added _after the `dedupExchange`_ and _before the `cacheExchange`_.

## Usage

After installing `@urql/exchange-suspense` and adding it to your `urql` client,
`urql` will load all your queries in suspense mode. So instead of relying
on the `fetching` flag, you can wrap your components in a `<Suspense>`
element.

```js
import React from 'react';
import { useQuery } from 'urql';

const LoadingIndicator = () => (
  <h1>Loading...</h1>
);

const YourContent = () => {
  const [result] = useQuery({ query: allPostsQuery });
  // result.fetching will always be false here, as
  // this component only renders when it has data
  return null; // ...
};

<React.Suspense fallback={<LoadingIndicator />}>
  <YourContent />
</React.Suspense>
```

Note that in React Suspense, the thrown promises bubble up the component tree until the first `React.Suspense` boundary. This means that the Suspense boundary does not need to be the immediate parent of the component that does the fetching! You should place it in the component hierarchy wherever you want to see the fallback loading indicator, e.g.

```js
<React.Suspense fallback={<LoadingIndicator />}>
  <AnyOtherComponent>
    <AsDeepAsYouWant>
      <YourContent />
    </AsDeepAsYouWant>
  </AnyOtherComponent>
</React.Suspense>
```

[You can also find a fully working demo on CodeSandbox.](https://codesandbox.io/s/urql-client-side-suspense-demo-81obe)
