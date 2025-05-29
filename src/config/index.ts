// src\config\index.ts
declare const APP_CONFIG: {
  mode: string;
  api_url: string;
  ws_url: string;
  token: string;
  version: string;
};

class Config {
  mode:string;
  token:string;
  api_url:string;
  ws_url: string;
  version: string;
  local_storage_name:string;

  constructor(){
    this.mode = APP_CONFIG.mode??'prod';
    this.api_url = APP_CONFIG.api_url??'http://localhost:3000/graphql';
    this.ws_url = APP_CONFIG.ws_url??'ws://localhost:3000/graphql';
    this.token = APP_CONFIG.token ?? 'token';
    this.version = APP_CONFIG.version;
    this.local_storage_name = 'lilith-storage';    
  }
}

const config = new Config();

export default config;