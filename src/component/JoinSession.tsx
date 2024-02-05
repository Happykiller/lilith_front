import * as React from 'react';
import { Trans } from 'react-i18next';
import { Button } from '@mui/material';
import InputIcon from '@mui/icons-material/Input';
import { useMutation } from "@apollo/client";

import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const JoinSession = (param: {
  session: any
}) => {
  const context:ContextStore = contextStore();
  const [joinSessionSmt, { data, loading, error }] = useMutation(GQL.MUT_JOIN_SESSION);

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  if (!context.code) {
    return <Trans>joinSession.log</Trans>
  } else {
    if (!param.session.members.includes(context.code)) {
      return (
        <div>
          <form className="formJoinSession"
            onSubmit={e => {
              e.preventDefault();
              joinSessionSmt({ variables: { 
                sessionId: context.sessionId,
                username: context.code
              } });
            }}
          >
            <Button 
              type="submit"
              variant="contained"
              size="small"
              startIcon={<InputIcon />}
            ><Trans>joinSession.join</Trans></Button>
          </form>
        </div>
      );
    }
  }
};