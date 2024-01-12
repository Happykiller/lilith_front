import React = require('react');
import { createClient } from 'graphql-ws';
import { createRoot } from 'react-dom/client';
import { ApolloProvider, DefaultOptions } from "@apollo/client";
import { split, HttpLink } from "@apollo/client";
import CssBaseline from '@mui/material/CssBaseline';
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import './index.scss';
import Root from './components/Root';

const wsLink = new GraphQLWsLink(createClient({
  url: process.env.APP_WS_URL,
  lazy: true,
  connectionParams: async () => {
    return {
      Authorization: `Bearer ${process.env.APP_API_TOKEN}`
    };
},
}));

const httpLink = new HttpLink({
  uri: process.env.APP_API_URL
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer token`,
    },
  };
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  mutate: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        sessions: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      },
    },
    Subscription: {
      fields: {
        subToSessions: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      },
    },
    SessionItemRecordObjectResolver: {
      fields: {
        votes: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache,
  defaultOptions
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Root param='Max' />
    </ThemeProvider>
  </ApolloProvider>
);