import * as React from 'react';
import { Trans } from 'react-i18next';
import { useQuery } from '@apollo/client';

import '@component/footer.scss';
import { GQL } from '@src/common/gql';
import { version } from '../../package.json';

export const Footer = () => {
  let backVersion = '';
  const respQry:{ loading:any, error?:any, data:any } = useQuery(GQL.QRY_SYSTEMINFO);

  if (respQry.loading) {
    backVersion = 'Loading...';
  }
  if (respQry.error) {
    backVersion = `Error! ${respQry.error.message}`;
  }
  if (!respQry.data) {
    backVersion = 'Nothing';
  } else {
    backVersion = respQry.data.systemInfo.version;
  }

  return (
    <div className='footer'>
      Projet Lilith - <a href="mailto:fabrice.rosito@gmail.com">Envoyer Email</a> - <Trans>version.front</Trans>{version} - <Trans>version.back</Trans>{backVersion} - <a href="https://github.com/Happykiller/lilith_front/issues" target="_blank"><Trans>footer.issues</Trans></a>  - <a href="https://github.com/users/Happykiller/projects/1/views/1" target="_blank"><Trans>footer.roadmap</Trans></a>
    </div>
  )
}