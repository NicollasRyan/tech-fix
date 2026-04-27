import type { FirestoreDateLike } from "../types/service.ts";
import type { ServiceDoc } from "../types/service.ts";

export const toJsDate = (value: FirestoreDateLike | Date | undefined) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const maybeDate = value.toDate?.();
  if (!(maybeDate instanceof Date) || Number.isNaN(maybeDate.getTime())) {
    return null;
  }

  return maybeDate;
};

export const formatPtBrDate = (
  value: FirestoreDateLike | Date | undefined,
  fallback = "-",
) => {
  const date = toJsDate(value);
  return date ? date.toLocaleDateString("pt-BR") : fallback;
};

export const getServicePrimaryDate = (
  service: Pick<ServiceDoc, "serviceDate" | "createdAt" >,
) => service.serviceDate ?? service.createdAt ?? service.serviceDate ?? null;
