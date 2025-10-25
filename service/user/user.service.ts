import { CookieHelper } from "../../helper/cookie.helper";
import { Fetch } from "../../lib/Fetch";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const UserService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const data = {
      email: email,
      password: password,
    };
    return await Fetch.post("/auth/login", data, config);
  },
  register: async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const data = {
      username: username,
      email: email,
      password: password,
    };
    return await Fetch.post("/auth/register", data, config);
  },
  forgotPassword: async (email: string) => {
    const data = {
      email: email,
    };
    return await Fetch.post("/auth/reset-password", data, config);
  },
  verifyEmail: async ({ email, token }: { email: string; token: string }) => {
    const data = {
      email: email,
      token: token,
    };
    return await Fetch.post("/auth/verify-email", data, config);
  },
  newPasswordSet: async ({
    email,
    token,
    password,
  }: {
    email: string;
    token: string;
    password: string;
  }) => {
    const data = {
      email: email,
      token: token,
      password: password,
    };
    return await Fetch.post("/auth/reset-password", data, config);
  },
  logout: (context = null) => {
    CookieHelper.destroy({ key: "token", context });
  },
  createData: async (endpoint, data, token) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.post(`${endpoint}`, data, _config);
  },
  addFormData: async (endpoint, data, token) => {
    const _config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.post(`${endpoint}`, data, _config);
  },
  // update Request ==================
  updateData: async (endpoint, data, token) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.patch(`${endpoint}`, data, _config);
  },

  // delete request ===============
  deleteData: async (endpoint, token) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.delete(`${endpoint}`, _config);
  },
  // All get Request===================
  getData: async (endpoint, token) => {
    // const userToken = CookieHelper.get({ key: "token", context });
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`${endpoint}`, _config);
  },

  updateQuestion: async (endpoint, data, token) => {
    const _config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.patch(`${endpoint}`, data, _config);
  },

  updateFormData: async (endpoint, data, token) => {
    const _config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.patch(`${endpoint}`, data, _config);
  },

  //
};
