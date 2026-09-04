import { baseApi } from "@/const/base-api";
import { RestEndpoint } from "@/const/rest-endpoint";

export const AuthService = {
  session: async (idToken: string) => {
    const res = await baseApi.post(RestEndpoint.PostSession, { idToken });
    return res.data;
  },

  register: async (idToken: string) => {
    const res = await baseApi.post(RestEndpoint.PostRegister, { idToken });
    return res.data;
  },

  google: async (idToken: string) => {
    const res = await baseApi.post(RestEndpoint.PostAuthGoogle, { idToken });
    return res.data;
  },

  logout: async () => {
    const res = await baseApi.post(RestEndpoint.PostLogout);
    return res.data;
  },

  me: async () => {
    const res = await baseApi.get(RestEndpoint.GetMe);
    return res.data;
  },
};
