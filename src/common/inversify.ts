// src\common\inversify.ts
import config from '@src/config';
import { GraphqlService, GraphqlServiceFake, GraphqlServiceFetch, SystemInfoUsecase } from '@happykiller/sunny-ui';

export class Inversify {
  graphqlService: GraphqlService;
  systemInfoUsecase: SystemInfoUsecase;

  constructor() {
    // Usecases
    this.systemInfoUsecase = new SystemInfoUsecase(this);

    // Services
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