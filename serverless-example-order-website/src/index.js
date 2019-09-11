import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';import 'semantic-ui-css/semantic.min.css'

import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from "react-apollo";

// TODO: Fetch ApolloClient uri from env variables
export const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/graphql' : 'https://dav209yem7.execute-api.eu-west-1.amazonaws.com/development/graphql',
});

ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


