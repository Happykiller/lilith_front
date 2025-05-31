// src\usecases\sessionInfo\model\sessionInfo.usecase.model.ts
export interface SessionInfoUsecaseModel {
  message: string;
  data?: {
    id: string;
    code: string;
    access_token: string;
  },
  error?: string;
}