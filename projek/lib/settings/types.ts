export interface NotificationSettings {
  emailPromo: boolean;
  orderStatus: boolean;
  wishlistPriceDrop: boolean;
  pushNotification: boolean;
}

export interface PrivacySettings {
  purchaseHistoryVisible: boolean;
}

export type ThemePreference = "terang" | "gelap" | "sistem";

export interface DisplaySettings {
  theme: ThemePreference;
}

export type Language = "id" | "en";
export type Currency = "IDR" | "USD";

export interface RegionSettings {
  language: Language;
  currency: Currency;
}

export interface AppSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  display: DisplaySettings;
  region: RegionSettings;
}
