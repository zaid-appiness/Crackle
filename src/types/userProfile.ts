export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  watchHistory: [];
  watchlist: [];
  ratings: [];
  darkMode: boolean;
  emailNotifications: boolean;
}
