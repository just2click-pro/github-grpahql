const g = require('graphql-request');
const express = require ('express');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const { GraphQLClient, gql } = g;

// Configure Environment
require('dotenv').config();

const TOKEN = process.env.API_GITHUB_TOKEN;

const app = express();
const defaultPort = process.env.PORT;
const url = 'https://api.github.com/graphql';

const graphQLClient = new GraphQLClient(url, {
    headers: {
        authorization: `Bearer ${TOKEN}`,
    }
})

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.get('/', (req, res) => {
    res.send('Hello world!');
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.get('/github-profile', async(req, res) => {
    // The query to get the profile information
    const query = gql`
        {
            viewer {
                login
                name
                company
                url
                bio
            }
        }
    `;

    // Make GraphQL call
    const githubRes = await graphQLClient.request(query);
    // respond with the results
    res.json(githubRes)
})

const server = app.listen(defaultPort, () => {
    const port = server.address().port;

    console.log(`Running a GraphQL API sever at http://localhost:${ port }/graphql`);
})