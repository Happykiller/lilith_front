import React, { useState } from 'react';

import ReactDOM from 'react-dom/client';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from "@apollo/client";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloProvider, DefaultOptions } from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import '@src/i18n';
import '@src/index.scss';
import App from '@src/App';
import getTheme from '@src/theme';

const getToken = () => {
  let token = process.env.APP_API_TOKEN;
  try {
    const lilithStorage = JSON.parse(sessionStorage.getItem("lilith-storage") ?? '');
    token = lilithStorage.state.accessToken;
  } catch (e) { }
  return token;
}

const wsLink = new GraphQLWsLink(createClient({
  url: process.env.APP_WS_URL ?? '',
  lazy: true,
  connectionParams: async () => {
    return {
      Authorization: `Bearer ${getToken()}`
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
  // State to determine whether dark mode is enabled
  const [darkMode] = useState(true);

  // Create the theme based on the current mode (dark or light)
  const theme = getTheme(darkMode ? 'dark' : 'light');

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

// Create a root for rendering with ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// Render the Index component into the root element
root.render(<Index />);