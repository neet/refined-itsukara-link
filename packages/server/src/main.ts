import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { APP_PORT } from './config';
import { dataSources } from './datasources';
import { resolvers } from './resolvers';

(async () => {
  const schemaPath = require.resolve('@ril/schema');
  const staticDir = path.resolve(require.resolve('@ril/client'), '..');

  // tslint:disable-next-line:non-literal-fs-path
  const schema = await fs.readFile(schemaPath, 'utf-8').then(gql);

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    dataSources,
  });

  const app = express();
  server.applyMiddleware({ app, path: '/graphql' });

  // CORS
  app.use(cors());
  app.options('*', cors());

  // Static files
  app.use(express.static(staticDir));
  // Service worker
  app.use('/sw.js', (_, res) =>
    res.sendFile(path.resolve(staticDir, 'build/sw.js')),
  );
  // SPA
  app.use('/*', (_, res) =>
    res.sendFile(path.resolve(staticDir, 'build/index.html')),
  );

  app.listen({ port: APP_PORT });
})();
