// src\index.tsx
/// <reference path="./theme/mui.d.ts" />
import '@fontsource/roboto';
import '@fontsource/montserrat';
import '@fontsource/roboto/400.css';
import '@fontsource/montserrat/600.css';

import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloProvider, DefaultOptions } from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import App from '@src/App';
import initI18n from '@src/i18n';
import config from '@src/config';
import { getTheme } from '@src/theme';
import { contextStore } from '@stores/ContextStore';

const getToken = () => {
  let token = config.token;
  try {
    const lilithStorage = JSON.parse(localStorage.getItem("lilith-storage") ?? '');
    token = lilithStorage.state.accessToken;
  } catch (e) { }
  return token;
}

const wsLink = new GraphQLWsLink(createClient({
  url: config.ws_url ?? '',
  lazy: true,
  connectionParams: async () => {
    return {
      Authorization: `Bearer ${getToken()}`
    };
  },
}));

const httpLink = new HttpLink({
  uri: config.api_url
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${getToken()}`,
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
        games: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      },
    },
    Subscription: {
      fields: {
        subToGames: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      },
    },
    ItemResolverModel: {
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

export const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache,
  defaultOptions
});

const Index: React.FC = () => {
  const themeMode = contextStore((s) => s.themeMode);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        {/* Provide the theme to the entire application */}
        <ThemeProvider theme={theme}>
          {/* Apply CSS baseline to ensure consistent styling across browsers */}
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  );
};

// Initialize i18n and then render the app
initI18n().then(() => {
  // Create a root for rendering with ReactDOM.createRoot
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  // Render the Index component into the root element
  root.render(<Index />);
});