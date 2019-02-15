export type TokenStore = 'vuex' | 'localStorage' | 'sessionStorage' | 'cookie';
export type Redirect = { path: string; };
export type Method = 'GET' | 'POST';
export type BasicRedirectData = { url: string; method: Method; };
export type BasicRedirectEnabledData = { url: string; method: Method; enabled?: boolean;  };
export type RedirectData = BasicRedirectData & { redirect?: string; };
export type LoginRedirectData = RedirectData & { fetchUser?: boolean };
export type RequestRedirectData = RedirectData & { makeRequest?: boolean };
export type FetchData = BasicRedirectEnabledData & { interval?: number };
export type OAuthData = {
  url: string;
  params: {
    client_id: string;
    redirect_uri: string;
    scope: string;
  }
};

export type AuthUser = { [key: string]: any };

export interface VueAuthOptions {
  authMeta?: string;
  rolesVar?: string;
  tokenDefaultName?: string;
  userDefaultName?: string;
  tokenStore?: TokenStore[];
  vuexStoreSpace?: string;
  headerTokenReplace?: string;

  authRedirect?: Redirect;

  registerData?: RedirectData;
  loginData?: LoginRedirectData;
  logoutData?: RequestRedirectData;
  fetchData?: FetchData;
  // refreshData?: RefreshData;

  facebookData?: RedirectData;
  googleData?: RedirectData;

  facebookOauth2Data?: OAuthData;
  googleOauth2Data?: OAuthData;
}
