import { gql } from '@apollo/client';

export class GQL {
  static QRY_GAMES = gql`
    query {
      games {
        id
        name
      }
    }
  `;

  static QRY_GAME = gql`
    query game($game_id: String!) {
      game(
        dto: {
          game_id: $game_id
        }
      ) {
        id
        name
        voting
        author_id
        author {
          id
          code
        }
        members
        members_obj {
          id
          code
        }
        items {
          id
          name
          author_id
          author {
            id
            code
          }
          state
          votes {
            id
            author_id
            author {
              id
              code
            }
            vote
          }
        }
      }
    }
  `;

  static QRY_AUTH = gql`
    query auth($login: String!, $secret: String!) {
      auth (
        dto: {
          login: $login
          secret: $secret
        }
      ) {
        id
        code
        accessToken
      }
    }
  `;

  static MUT_REVEAL = gql`
    mutation reveal(
      $game_id: String!
      $item_id: String!
    ) {
      reveal(
        dto: {
          game_id: $game_id
          item_id: $item_id
        }
      )
    }
  `;

  static MUT_RESET = gql`
    mutation removeVote(
      $game_id: String!
      $item_id: String!
      $vote_id: String!
    ) {
      deleteVote(
        dto: {
          game_id: $game_id
          item_id: $item_id
          vote_id: $vote_id
        }
      )
    }
  `;

  static SUB_GAME = gql`
    subscription onChange($game_id: String!) {
      subToGame (
        dto: {
          game_id: $game_id
        }
      ) {
        id
        name
        voting
        members
        items {
          id
          name
          author_id
          state
          votes {
            id
            author_id
            vote
          }
        }
      }
    }
  `;

  static MUT_CREATE_GAME = gql`
    mutation createGame($name: String!, $voting: [String!]) {  
      createGame (
        dto: {
          name: $name
          voting: $voting
        }
      ) {
        id
        name
        voting
        author_id
        author {
          id
          code
        }
        members
        members_obj {
          id
          code
        }
        items {
          id
          name
          author_id
          author {
            id
            code
          }
          state
          votes {
            id
            author_id
            author {
              id
              code
            }
            vote
          }
        }
      }
    }
  `;

  static MUT_CREATE_VOTE = gql`
    mutation createVote (
      $game_id: String!
      $item_id: String!
      $vote: String!
    ) {  
      createVote (
        dto: {
          game_id: $game_id
          item_id: $item_id
          vote: $vote
        }
      ) {
        id
        author_id
        vote
      }
    }
  `;

  static MUT_CREATE_ITEM = gql`
    mutation createItem(
      $game_id: String!
      $name: String!
    ) {  
      createItem (
        dto: {
          game_id: $game_id
          name: $name
        }
      ) {
        id
        name
        author_id
        state
        votes {
          id
          author_id
          vote
        }
      }
    }
  `;

  static MUT_JOIN_GAME = gql`
    mutation joinGame($game_id: String!) {  
      joinGame (
        dto: {
          game_id: $game_id
        }
      )
    }
  `;

  static SUB_GAMES = gql`
  subscription onNewGame {
    subToGames {
      id
      name
    }
  }
  `;

  static QRY_SYSTEMINFO = gql`
    query systemInfo {
      systemInfo {
        version
      }
    }
  `;
}