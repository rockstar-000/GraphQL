const { makeExecutableSchema } = require('graphql-tools');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const express = require('express');
const { typeDefs, resolvers } = require('./schema');

const PORT = 4000;
const WS_PORT = 4001;

// Setup websocket server
const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

const subscriptionServer = SubscriptionServer.create(
  {
    execute,
    subscribe,
    schema: makeExecutableSchema({ typeDefs, resolvers }),
  },
  {
    server: websocketServer,
    path: '/graphql',
  }
);

websocketServer.listen(WS_PORT, () =>
  console.log(`Websocket Server is now running on http://localhost:${WS_PORT}`)
);

// Setup graphql server
const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptionsPath: `http://localhost:${WS_PORT}`,
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(
    `server listening at http://localhost:${PORT}${server.graphqlPath}`
  )
);
// const { typeDefs, resolvers } = require('./schema');

// const PORT = 3001;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// server.applyMiddleware({ app });

// const webServer = createServer(app);
// server.installSubscriptionHandlers(webServer);

// const graphqlEndpoint = `http://localhost:${PORT}${server.graphqlPath}`;
// const subscriptionEndpoint = `ws://localhost:${PORT}${
//   server.subscriptionsPath
// }`;

// app.use(cors());
// app.get(
//   '/',
//   expressPlayground({
//     endpoint: graphqlEndpoint,
//     subscriptionEndpoint: subscriptionEndpoint,
//   })
// );

// webServer.listen(PORT, () => {
//   console.log(`🚀 Server ready at ${graphqlEndpoint}`);
//   console.log(`🚀 Subscriptions ready at ${subscriptionEndpoint}`);
// });

// // const { createServer } = require('http');
// // const { SubscriptionServer } = require('subscriptions-transport-ws');
// // const { execute, subscribe } = require('graphql');
// // const schema = require('./schema');

// // const WS_PORT = 4000;

// // // Create WebSocket listener server
// // const websocketServer = createServer((request, response) => {
// //   response.writeHead(404);
// //   response.end();
// // });

// // // Bind it to port and start listening
// // websocketServer.listen(WS_PORT, () =>
// //   console.log(`Websocket Server is now running on http://localhost:${WS_PORT}`)
// // );

// // const subscriptionServer = SubscriptionServer.create(
// //   {
// //     schema,
// //     execute,
// //     subscribe,
// //   },
// //   {
// //     server: websocketServer,
// //     path: '/graphql',
// //   }
// // );
