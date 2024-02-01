import * as React from 'react';
import { useState } from "react";
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputIcon from '@mui/icons-material/Input';
import RestartAlt from '@mui/icons-material/RestartAlt';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import '@component/root.scss';
import { GQL } from '@src/common/gql';
import { FormName } from '@src/component/FormName';
import { FormSession } from '@component/FormSession';
import { DebugSession } from '@component/DebugSession';
import { sessionStore } from '@component/SessionStore';

const Sessions = () => {
  const myContext = React.useContext(MyContext);
  const { loading, error, data, subscribeToMore } = useQuery(GQL.QRY_SESSIONS);

  subscribeToMore({
    document: GQL.SUB_SESSIONS,
    updateQuery: (prev:any, { subscriptionData }:any) => {
      if (!subscriptionData.data) return prev;
      const sessions = subscriptionData.data.subToSessions;
      return {
        sessions: sessions,
      };
    },
  });

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;
  if (!data) return <p>Nothing</p>;

  return (
    <div>
      <List>
        {data.sessions.map((session: any) => (
          <ListItem disablePadding key={session.id}>
            <div style={{
              margin: "5px 0"
            }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<InputIcon />}
                disabled={(myContext.sessionId === session.id)}
                onClick={(e) => {
                  myContext.setSessionId(session.id);
                }}
              >{session.name}</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const Session = () => {
  const myContext = React.useContext(MyContext);

  if (myContext.sessionId) {

    const respQry:{ loading:any, error?:any, data:any } = useQuery(GQL.QRY_SESSION, {
      variables: {
        sessionId: myContext.sessionId
      },
    });

    const respSub:{loading:any, data?:any } = useSubscription(
      GQL.SUB_SESSION,
      { 
        variables: {
          sessionId: myContext.sessionId
        }
      }
    );

    //if (respQry.loading || respSub.loading) return <p>"Loading...";</p>;
    if (respQry.error) return <p>`Error! ${respQry.error.message}`</p>;
    if (!respQry.data && !respSub.data) return <p>Nothing</p>;

    const data = {
      session: respQry.data?.session || respSub.data?.subToSession
    }

    let formCreateItem;
    if (
      sessionStore.getState().name
      && data.session.members.includes(sessionStore.getState().name)
    ) {
      formCreateItem = <CreateItem />
    } else {
      formCreateItem = <p></p>
    }

    return (
      <div>
        <p>
          <u>Session</u> : {data.session.name}
        </p>
        <JoinSession 
          session={data.session} 
        />
        <p>
          <u>Les items</u> :
        </p>
        {formCreateItem}
        <List>
          {data.session.items.map((item: any) => (
            <ListItem disablePadding key={item.id}>
              <div style={{
                margin: "5px 0"
              }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<InputIcon />}
                  disabled={(myContext.itemId === item.id)}
                  onClick={(e) => { 
                    myContext.setItemId(item.id);
                  }}
                >{item.name}</Button>
              </div>
            </ListItem>
          ))}
        </List>
        <Item
          session={data.session}
        />
      </div>
    );
  } else {
    return (
      <div>
        <p>
          Merci de choisir une session
        </p>
      </div>
    );
  }
}

const Item = (param: {
  session: any
}) => {
  const myContext = React.useContext(MyContext);
  if (myContext.itemId) {
    const currentItem = param.session.items.find((item:any) => item.id === myContext.itemId);

    if (currentItem) {
      const [RevealSmt, { data, loading, error }] = useMutation(GQL.MUT_REVEAL);
      const [resetSmt, state] = useMutation(GQL.MUT_RESET);

      let formVote;
      if (
        currentItem
        && sessionStore.getState().name 
        && currentItem.state !== 'REVEAL'
        && param.session.members.includes(sessionStore.getState().name)
        && !currentItem.votes.find((elt:any) => elt.member === sessionStore.getState().name)
      ) {
        formVote = <CreateVote
        session={param.session}
        />
      } else {
        formVote = <p></p>
      }

      let revealBt;
      if (
        currentItem
        && currentItem.state !== 'REVEAL'
        && param.session.members.includes(sessionStore.getState().name)
        && sessionStore.getState().name === currentItem.author
      ) {
        revealBt = <form
        onSubmit={e => { 
          e.preventDefault();
          RevealSmt({ variables: { 
            sessionId: myContext.sessionId,
            itemId: currentItem.id
          } });
        }}
      >
        <Button 
          type="submit"
          variant="contained"
          size="small"
          startIcon={<Add />}
        >Reveal</Button>
      </form>
      } else {
        revealBt = <p></p>
      }

      return <div>
        <p>
          <u>Item</u> : {currentItem.name} (state:{currentItem.state})
        </p>
        {revealBt}
        <List>
          {
            param.session.members.map((member: any) => {
              const vote = currentItem.votes.find((vote:any) => vote.member === member);
              if (!vote) {
                if (currentItem.state !== 'REVEAL') {
                  return (
                    <ListItem disablePadding key={member}>
                      {member} =&gt; ?
                    </ListItem>
                  )
                } else {
                  return
                }
              } else if (vote.member === sessionStore.getState().name) {
                if (currentItem.state !== 'REVEAL') {
                  return (
                    <ListItem disablePadding key={member}>
                      {vote.member} =&gt; {vote.vote} <form
                        onSubmit={e => { 
                          e.preventDefault();
                          resetSmt({ 
                            variables: { 
                              sessionId: myContext.sessionId,
                              itemId: currentItem.id,
                              voteId: vote.id
                            } 
                          });
                        }}
                      >
                        <Button 
                          type="submit"
                          variant="contained"
                          size="small"
                          startIcon={<RestartAlt />}
                        >Reset</Button>
                      </form>
                    </ListItem>
                  )
                } else {
                  return (
                    <ListItem disablePadding key={member}>
                      {vote.member} =&gt; {vote.vote}
                    </ListItem>
                  )
                }
              } else if (currentItem.state === 'REVEAL') {
                return (
                  <ListItem disablePadding key={member}>
                    {vote.member} =&gt; {vote.vote}
                  </ListItem>
                )
              } else {
                return (
                  <ListItem disablePadding key={member}>
                    {vote.member} =&gt; Suspense
                  </ListItem>
                )  
              }
            })
          }
        </List>
        {formVote}
      </div>
    }
    
  } else {
    return <p></p>
  }
}

const CreateVote = (param: {
  session: any
}) => {
  const myContext = React.useContext(MyContext);
  const [CreateVoteSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_VOTE);
  const [vote, setVote] = useState('L');

  const handleChange = (event: SelectChangeEvent) => {
    const voteChoosen = event.target.value;
    setVote(voteChoosen);
  };

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  if (sessionStore.getState().name && param.session.members.find((elt:any) => elt.name === sessionStore.getState().name)) {
    return <p></p>
  } else {
    return (
      <div>
        <form className="formCreateVote"
          onSubmit={e => {
            e.preventDefault();
            CreateVoteSmt({ variables: { 
              sessionId: myContext.sessionId,
              member: sessionStore.getState().name,
              vote: vote,
              itemId: myContext.itemId
            } });
          }}
        >
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={vote}
            label="Vote"
            onChange={handleChange}
          >
            {param.session.voting.map((voting: any) => (
              <MenuItem value={voting} key={voting}>{voting}</MenuItem>
            ))}
          </Select>
          <Button 
            type="submit"
            variant="contained"
            size="small"
            startIcon={<Add />}
          >Vote</Button>
        </form>
      </div>
    );
  }
};

const JoinSession = (param: {
  session: any
}) => {
  const myContext = React.useContext(MyContext);
  const [joinSessionSmt, { data, loading, error }] = useMutation(GQL.MUT_JOIN_SESSION);

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  if (!sessionStore.getState().name) {
    return (
      <div>
        Merci de vous identifier
      </div>
    )
  } else {
    if (!param.session.members.includes(sessionStore.getState().name)) {
      return (
        <div>
          <form className="formJoinSession"
            onSubmit={e => {
              e.preventDefault();
              joinSessionSmt({ variables: { 
                sessionId: myContext.sessionId,
                username: sessionStore.getState().name
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



const CreateItem = () => {
  const myContext = React.useContext(MyContext);
  const [name, setName] = useState('');
  const [createSessionSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_ITEM);

  if (error) return <p>`Error! ${error.message}`</p>;

  return (
    <div>
      <form className="formCreateItem"
        onSubmit={e => {
          e.preventDefault();
          createSessionSmt({ variables: { 
            name, 
            sessionId: myContext.sessionId,
            author: sessionStore.getState().name
          } });
          setName('');
        }}
      >
        <TextField
          label="Item name"
          variant="standard"
          size="small"
          value={name}
          onChange={(e) => { setName(e.target.value) }}
        />
        <Button 
          type="submit"
          variant="contained"
          size="small"
          startIcon={<Add />}
          disabled={!(name && name.length > 3) || sessionStore.getState().name === null}
        >Create</Button>
      </form>
    </div>
  );
};
 
interface RootProps {
  param?: string
}

interface AppState {
  sessionId: string,
  itemId: string,
  name: string
}

export const MyContext = React.createContext({
  name: null,
  setName: (name:string) => {},
  sessionId: null,
  setSessionId: (sessionId:string) => {},
  itemId: null,
  setItemId: (itemId:string) => {},
  unSubscriptSession: () => {}
});
 
class Root extends React.Component<RootProps, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {
      name: null,
      sessionId: null,
      itemId: null
    }
  }

  setSessionId = (sessionId: string) => {
    this.setState({
      sessionId,
      itemId: null
    });
  }

  setItemId = (itemId: string) => {
    this.setState({
      itemId
    });
  }

  setName = (name: string) => {
    this.setState({ 
      name 
    });
  };

  unSubscriptSession = () => {}

  render() {

    const myContextValue = {
      name: this.state.name, 
      setName: this.setName,
      sessionId: this.state.sessionId, 
      setSessionId: this.setSessionId,
      itemId: this.state.itemId, 
      setItemId: this.setItemId,
      unSubscriptSession: this.unSubscriptSession,
    };

    return (
      <div className='root'>
        <MyContext.Provider value={myContextValue}>
          <h1>Lilith</h1>
          <DebugSession />
          <div className='app-container '>
            <div className='left-container'>
              <Session/>
            </div>
            <div className='right-container'>
              <FormName />
              <FormSession />
              <Sessions/>
            </div>
          </div>
        </MyContext.Provider>
      </div>
    )
  }
}
 
export default Root;