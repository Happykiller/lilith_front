// src\presentation\Layout\LayoutProtectedExt.tsx
import inversify from '@src/common/inversify';
import { LayoutProtected } from '@happykiller/sunny-ui';
import { HeaderExt } from '@components/layouts/HeaderExt';
import { FooterExt } from '@components/layouts/FooterExt';
import { contextStore } from '@stores/ContextStore';

export function LayoutProtectedExt({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProtected
      header={<HeaderExt />}
      footer={<FooterExt />}
      sessionInfoUsecase={inversify.sessionInfoUsecase}
      loggerService={inversify.loggerService}
      contextStore={contextStore}
    >
      {children}
    </LayoutProtected>
  );
}
