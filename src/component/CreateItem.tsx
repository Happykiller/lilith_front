import * as React from 'react';
import { Add } from '@mui/icons-material';
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from 'react-i18next';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, Chip, Divider, Grid, IconButton, TextField } from '@mui/material';

import { GQL } from '@src/common/gql';
import { FlashStore, flashStore } from '@component/Flash';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const CreateItem = () => {
  const [item, setItem] = React.useState({
    label: null,
    url: null,
    description: null
  });
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const context:ContextStore = contextStore();
  const [formVisible, setFormVisible] = React.useState(false);
  const [createItemSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_ITEM);

  if (error) return <p>`Error! ${error.message}`</p>;

  return (
    <div>
      <Divider>
        <Chip 
          label={<Trans>createItem.title</Trans>}
        />
        {/* Open  */}
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            setFormVisible(!formVisible);
          }
        }>
          {formVisible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Divider>
      <form className="formCreateItem"
        onSubmit={e => {
          e.preventDefault();
          createItemSmt({ variables: { 
            name: item.label, 
            url: item.url,
            description: item.description,
            game_id: context.game_id
          } });
          setItem({
            label: null,
            url: null,
            description: null
          });
          flash.open(t('createItem.created'));
        }}
      >
        <Grid
          container
          display={(formVisible) ? "flex" : "none"}
        >
          <Grid
            item
            xs={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              label={<Trans>createItem.label</Trans>}
              variant="standard"
              size="small"
              value={item.label??''}
              onChange={(e) => { setItem({
                  ... item,
                  label: e.target.value
                }) 
              }}
            />
          </Grid>

          <Grid
            item
            xs={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              label={<Trans>createItem.url</Trans>}
              variant="standard"
              size="small"
              value={item.url??''}
              onChange={(e) => { setItem({
                ... item,
                url: e.target.value
              }) 
            }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              label={<Trans>createItem.description</Trans>}
              variant="standard"
              fullWidth
              value={item.description??''}
              onChange={(e) => { setItem({
                ... item,
                description: e.target.value
              }) 
            }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            m={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button 
              type="submit"
              variant="contained"
              size="small"
              startIcon={<Add />}
              disabled={!(item && item.label?.length > 3) || context.id === null}
            ><Trans>common.create</Trans></Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};