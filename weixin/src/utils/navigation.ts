import Taro from "@tarojs/taro";

// Matches zmp-ui's useNavigate() hook shape: `navigate(path, {replace, state})`.
// Keys are the original Zalo Mini App route paths (as used throughout
// client/src), values are the corresponding Taro page path registered in
// app.config.ts.
export const ROUTE_MAP: Record<string, string> = {
  "/": "/pages/index/index",
  "/search": "/pages/search/index",
  "/category": "/pages/category",
  "/notification": "/pages/notification",
  "/cart": "/pages/cart/index",
  "/profile": "/pages/profile",
  "/result": "/pages/result",
};

export interface NavigateOptions {
  replace?: boolean;
  // Taro/WeChat's navigateTo has no react-router-style `state` passing. As a
  // pragmatic stand-in, `state` is JSON-encoded into the URL's query string.
  // A later phase should read it back on the destination page via
  // `Taro.getCurrentInstance().router?.params` (values arrive as strings —
  // JSON.parse the relevant param back out).
  state?: any;
}

function resolvePath(path: string, state?: any): string {
  const base = ROUTE_MAP[path] ?? path;
  if (state === undefined) return base;
  const query = `state=${encodeURIComponent(JSON.stringify(state))}`;
  return base.includes("?") ? `${base}&${query}` : `${base}?${query}`;
}

export type NavigateFn = (path: string, opts?: NavigateOptions) => void;

export function useNavigate(): NavigateFn {
  return (path: string, opts?: NavigateOptions) => {
    const url = resolvePath(path, opts?.state);
    if (opts?.replace) {
      Taro.redirectTo({ url }).catch(() => {});
    } else {
      Taro.navigateTo({ url }).catch(() => {});
    }
  };
}
