// src\common\inversify.ts
import config from '@src/config';
import { SessionInfoUsecase } from '@usecases/sessionInfo/systemInfo.usecase';
import { GraphqlService, GraphqlServiceFake, GraphqlServiceFetch, LoggerService, LoggerServiceReal, SystemInfoUsecase } from '@happykiller/sunny-ui';

export class Inversify {
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  systemInfoUsecase: SystemInfoUsecase;
  sessionInfoUsecase: SessionInfoUsecase;

  constructor() {
    // Usecases
    this.systemInfoUsecase = new SystemInfoUsecase(this);
    this.sessionInfoUsecase = new SessionInfoUsecase(this);

    // Services
    this.loggerService = new LoggerServiceReal();
    if (config.mode === 'prod' || config.mode === 'dev') {
      this.graphqlService = new GraphqlServiceFetch(this, {
        apiUrl: config.api_url,
        storageName: config.local_storage_name
      });
    } else {
      this.graphqlService = new GraphqlServiceFake();
    }
  }
}

const inversify = new Inversify();

export default inversify;