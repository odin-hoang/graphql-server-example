import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js";
const resolvers = {
  Query: {
    games: () => db.games,
    game: (_: any, args: { id: string }) =>
      db.games.find((game) => game.id === args.id),
    reviews: () => db.reviews,
    review: (_: any, args: { id: string }) =>
      db.reviews.find((review) => review.id === args.id),
    authors: () => db.authors,
    author: (_: any, args: { id: string }) =>
      db.authors.find((author) => author.id === args.id),
  },
  Game: {
    reviews: (parent: { id: string }) =>
      db.reviews.filter((review) => review.game_id === parent.id),
  },
  Review: {
    game: (parent: { game_id: string }) =>
      db.games.find((game) => game.id === parent.game_id),
    author: (parent: { author_id: string }) =>
      db.authors.find((author) => author.id === parent.author_id),
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
