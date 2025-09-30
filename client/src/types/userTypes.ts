export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  categories: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
  preferances: UserPreferences;
  bookmarkedEvents: string[]; // assuming these are event IDs
  isVerified: boolean;
}
