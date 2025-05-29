// src\components\Layout\HeaderExt.tsx
import { Map, Language, Cloud, Email, BugReport, LightMode, DarkMode } from '@mui/icons-material';

import config from '@src/config';
import inversify from '@src/common/inversify';
import { Footer } from '@happykiller/sunny-ui';
import { contextStore } from '@stores/ContextStore';

export function FooterExt() {
  const mode = contextStore((s) => s.themeMode);
  const toggleTheme = contextStore((s) => s.toggleTheme);
  return <Footer
    systemInfoUsecase={inversify.systemInfoUsecase}
    frontVersion={config.version ?? '0.0.0'}
    issuesUrl="https://github.com/Happykiller/lilith_front/issues"
    projectUrl="https://github.com/users/Happykiller/projects/1/views/1"
    mailto="fabrice.rosito@gmail.com"
    brandName="Lilith"
    icons={{
      email: <Email fontSize="small" />,
      issues: <BugReport fontSize="small" />,
      roadmap: <Map fontSize="small" />,
      language: <Language fontSize="small" />,
      cloud: <Cloud fontSize="small" />
    }}
    onToggleTheme={toggleTheme}
    iconThemeToggle={mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
  />
}
