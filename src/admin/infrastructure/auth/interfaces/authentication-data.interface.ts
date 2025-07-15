export interface AuthenticationData {
  id: string;
  photo: string;
  name: string;
  surname: string;
  enabled: boolean;
  isLoggedIn: boolean;
  role: {
    id: number;
    name: string;
  };
}
