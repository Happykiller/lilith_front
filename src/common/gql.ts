import { gql } from '@apollo/client';

export class GQL {
  static QRY_SESSIONS = gql`
    query {
      sessions {
        id
        name
      }
    }
  `;

  static QRY_SESSION = gql`
    query session($sessionId: String!) {
      session(
        dto: {
          sessionId: $sessionId
        }
      ) {
        id
        name
        voting
        members
        items {
          id
          name
          author
          state
          votes {
            id
            member
            vote
          }
        }
      }
    }
  `;

  static MUT_REVEAL = gql`
    mutation reveal(
      $sessionId: String!,
      $itemId: String!
    ) {
      reveal(
        dto: {
          sessionId: $sessionId
          itemId: $itemId
        }
      )
    }
  `;

  static MUT_RESET = gql`
    mutation removeVote(
      $sessionId: String!,
      $itemId: String!,
      $voteId: String!
    ) {
      removeVote(
        dto: {
          sessionId: $sessionId
          itemId: $itemId
          voteId: $voteId
        }
      )
    }
  `;

  static SUB_SESSION = gql`
    subscription onChange($sessionId: String!) {
      subToSession (
        dto: {
          sessionId: $sessionId
        }
      ) {
        id
        name
        voting
        members
        items {
          id
          name
          author
          state
          votes {
            id
            member
            vote
          }
        }
      }
    }
  `;

  static MUT_CREATE_SESSION = gql`
    mutation createSession($name: String!) {  
      createSession (
        dto: {
          name: $name
        }
      ) {
        id
        name
        voting
      }
    }
  `;

  static MUT_CREATE_VOTE = gql`
    mutation createVote (
      $member: String!,
      $sessionId: String!,
      $itemId: String!,
      $vote: String!
    ) {  
      createVote (
        dto: {
          sessionId: $sessionId
          itemId: $itemId
          member: $member
          vote: $vote
        }
      ) {
        id
        member
        vote
      }
    }
  `;

  static MUT_CREATE_ITEM = gql`
    mutation createItem(
      $sessionId: String!,
      $name: String!,
      $author: String!
    ) {  
      createItem (
        dto: {
          sessionId: $sessionId
          name: $name
          author: $author
        }
      ) {
        id
        name
        author
        state
        votes {
          id
          member
          vote
        }
      }
    }
  `;

  static MUT_JOIN_SESSION = gql`
    mutation joinSession($sessionId: String!, $username: String!) {  
      joinSession (
        dto: {
          sessionId: $sessionId
          username: $username
        }
      )
    }
  `;

  static SUB_SESSIONS = gql`
  subscription onNewSession {
    subToSessions {
      id
      name
    }
  }
  `;
}