// src\components\Layout\HeaderExt.tsx
import MenuIcon from '@mui/icons-material/Menu';

import inversify from '@src/common/inversify';
import { Header } from '@happykiller/sunny-ui';
import { contextStore } from '@stores/ContextStore';

export function HeaderExt() {
  return <Header
    contextStore={contextStore()}
    routes={[]}
    settings={['logout']}
    brandName='Lilith'
    icons={{ menu: <MenuIcon /> }}
    onLogout={() => inversify.loggerService.log('logout')}
  />
}
export default HeaderExt;
