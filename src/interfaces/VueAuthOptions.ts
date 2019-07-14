import { AxiosResponse } from 'axios';

export type TokenStore = 'localStorage' | 'sessionStorage' | 'cookie' | 'vuex';
export type TokenType = 'Bearer' | 'Basic' | '';
export type Method = 'GET' | 'POST';

export interface BasicRedirectData {
  url: string;
  method: Method;
}

export interface OptionalRedirectData {
  url?: string;
  method?: Method;
}

export interface BasicRedirectEnabledData extends OptionalRedirectData {
  enabled?: boolean;
}

export interface RedirectData {
  redirect?: string;
}

export interface LoginRedirectData extends RedirectData, BasicRedirectData {
  headerToken?: string;
  fetchUser?: boolean;
  customToken?: (response: AxiosResponse) => string;
}

export interface LogoutRedirectData extends RedirectData, OptionalRedirectData {
  makeRequest?: boolean;
}

export interface FetchData extends BasicRedirectEnabledData {
  interval?: number;
}

export interface RefreshData extends FetchData {
  interval?: number;
}

export interface AuthUser {
  [key: string]: any;
}

export interface VueAuthOptions {
  authMeta?: string;
  rolesVar?: string;
  tokenDefaultName?: string;
  userDefaultName?: string;
  tokenStore?: TokenStore[];
  headerTokenReplace?: string;
  tokenType?: TokenType;
  vuexStoreSpace?: string;
  fetchItem?: string;

  authRedirect?: string;

  loginData?: LoginRedirectData;
  logoutData?: LogoutRedirectData;
  fetchData?: FetchData;
  refreshData?: RefreshData;
}
