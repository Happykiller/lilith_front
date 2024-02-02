import * as React from 'react';
import { Button } from '@mui/material';
import { useMutation } from "@apollo/client";

import { GQL } from '@src/common/gql';
import { Add } from '@mui/icons-material';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const JoinSession = (param: {
  session: any
}) => {
  const context:ContextStore = contextStore();
  const [joinSessionSmt, { data, loading, error }] = useMutation(GQL.MUT_JOIN_SESSION);

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  if (!context.login) {
    return (
      <div>
        Merci de vous identifier
      </div>
    )
  } else {
    if (!param.session.members.includes(context.login)) {
      return (
        <div>
          <form className="formJoinSession"
            onSubmit={e => {
              e.preventDefault();
              joinSessionSmt({ variables: { 
                sessionId: context.sessionId,
                username: context.login
              } });
            }}
          >
            <Button 
              type="submit"
              variant="contained"
              size="small"
              startIcon={<Add />}
            >Join</Button>
          </form>
        </div>
      );
    }
  }
};