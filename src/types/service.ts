import type { Timestamp } from "firebase/firestore";
import type { ServiceType } from "../constants/serviceTypes.ts";

export type FirestoreDateLike = Timestamp | { toDate: () => Date } | null;

export type MaintenanceItem = {
  id: string;
  description: string;
  dateService: FirestoreDateLike;
};

export type ServiceDoc = {
  id: string;
  userId: string;
  clientName: string;
  serviceType: ServiceType | string;
  description?: string;
  valueService: number | string;
  notificationDate: FirestoreDateLike;
  serviceDate?: FirestoreDateLike;
  createdAt?: FirestoreDateLike;
  manutencoes?: any[];
  phone?: string;
  email?: string;
  cpf?: string;
  address?: string;
  city?: string;
  equipmentModel?: string;
  equipmentBrand?: string;
  usedParts?: string[];
};
