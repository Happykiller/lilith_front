import React = require('react');
import { createClient } from 'graphql-ws';
import { createRoot } from 'react-dom/client';
import { split, HttpLink } from "@apollo/client";
import CssBaseline from '@mui/material/CssBaseline';
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloProvider, DefaultOptions } from "@apollo/client";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import '@src/i18n';
import '@src/index.scss';
import Root from '@component/Root';
import { Home } from '@component/Home';
import { Play } from '@component/PLay';
import { Admin } from '@component/Admin';
import { Guard } from './component/Guard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/root",
    element: <Guard><Root /></Guard>,
  },
  {
    path: "/admin",
    element: <Guard><Admin /></Guard>,
  },
  {
    path: "/play",
    element: <Play />,
  }
]);


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

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </ApolloProvider>
);