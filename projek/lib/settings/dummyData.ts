import type { AppSettings } from "./types";

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    emailPromo: true,
    orderStatus: true,
    wishlistPriceDrop: false,
    pushNotification: false,
  },
  privacy: {
    purchaseHistoryVisible: true,
  },
  display: {
    theme: "sistem",
  },
  region: {
    language: "id",
    currency: "IDR",
  },
};
