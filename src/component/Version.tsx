import * as React from 'react';
import { Trans } from 'react-i18next';
import { version } from '../../package.json';

export const Version = () => {
  return (
    <div>
      <Trans>version.label</Trans>{version}
    </div>
  )
}