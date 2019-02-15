export type TokenStore = 'vuex' | 'localStorage' | 'cookie';
export type Redirect = { path: string; };
export type Method = 'GET' | 'POST';
export type BasicRedirectData = { url: string; method: Method; enabled?: boolean; };
export type RedirectData = BasicRedirectData & { redirect?: string; };
export type LoginRedirectData = RedirectData & { fetchUser?: boolean };
export type RequestRedirectData = RedirectData & { makeRequest?: boolean };
export type RefreshData = BasicRedirectData & { interval: number };
export type OAuthData = {
  url: string;
  params: {
    client_id: string;
    redirect_uri: string;
    scope: string;
  }
};

export interface VueAuthOptions {
  authMeta?: string;
  vuexStoreSpace?: string;
  rolesVar?: string;
  // tokenImpersonateName?: string;
  tokenDefaultName?: string;
  tokenStore?: TokenStore[];

// Objects

  authRedirect?: Redirect;
  forbiddenRedirect?: Redirect;
  notFoundRedirect?: Redirect;

  registerData?: RedirectData;
  loginData?: LoginRedirectData;
  logoutData?: RequestRedirectData;
  oauth1Data?: BasicRedirectData;
  fetchData?: BasicRedirectData;
  refreshData?: RefreshData;
  // impersonateData?: RedirectData;
  // unimpersonateData?: RequestRedirectData;

  facebookData?: RedirectData;
  googleData?: RedirectData;

  facebookOauth2Data?: OAuthData;
  googleOauth2Data?: OAuthData;
}
