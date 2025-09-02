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
  logout: (context = null) => {
    CookieHelper.destroy({ key: "token", context });
  },
  addServices: async (data, token) => {
    const _config = {
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.post("/admin/services", data, _config);
  },
  addNewBlog: async (data, token) => {
    const _config = {
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.post("/admin/blog", data, _config);
  },
  // update Request ==================
  cofirmBooking: async (data, token, id) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.patch(
      `/admin/manage-bookings/completed-bookings/${id}`,
      data,
      _config
    );
  },
  acceptBooking: async (data, token, id) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.patch(
      `/admin/dashboard/service-booking/${id}`,
      data,
      _config
    );
  },
  rejectBooking: async (data, token, id) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.patch(
      `/admin/dashboard/service-booking/${id}`,
      data,
      _config
    );
  },
  updateBlog: async (data, token, id) => {
    const _config = {
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.patch(`/admin/blog/${id}`, data, _config);
  },
  updateProfile: async (data, token) => {
    const _config = {
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.patch(`/admin/profile/edit-profile`, data, _config);
  },
  // delete request ===============
  deleteBlog: async (token, id) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.delete(`/admin/blog/${id}`, _config);
  },
  // All get Request===================
  getAllBooking: async () => {
    // const userToken = CookieHelper.get({ key: "token", context });
    const _config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return await Fetch.get(`/admin/manage-bookings/allwork`, _config);
  },
  getOngoingBooking: async () => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return await Fetch.get(`/admin/manage-bookings/ongoing`, _config);
  },
  completeBooking: async () => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return await Fetch.get(
      `/admin/manage-bookings/completed-bookings`,
      _config
    );
  },
  getNotification: async (token: any) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`/admin/notification`, _config);
  },
  getAllService: async (token: any) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`/admin/services`, _config);
  },
  getSingleService: async (token: any, id: any) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`/admin/services/${id}`, _config);
  },
  getProfile: async (token: any) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`/admin/profile`, _config);
  },
  getDashBoardData: async (token: any) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`/admin/dashboard/`, _config);
  },
  getBlogs: async (token: any) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`/blog/`, _config);
  },
  getSingleBlog: async (token, id) => {
    // const userToken = CookieHelper.get({ key: "token", context });
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`/admin/blog/${id}`, _config);
  },
  getScheduleData: async (token: any) => {
    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    return await Fetch.get(`/admin/schedule-calender`, _config);
  },
  findAll: async (context = null) => {
    const userToken = CookieHelper.get({ key: "token", context });

    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };

    return await Fetch.get(`/user`, _config);
  },
  findOne: async (id: number, context = null) => {
    const userToken = CookieHelper.get({ key: "token", context });

    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };

    return await Fetch.get(`/user/${id}`, _config);
  },
  findOneByUsername: async ({
    username,
    token = "",
    context = null,
  }: {
    username: string;
    token?: string;
    context?: any;
  }) => {
    // const userToken = CookieHelper.get({ key: "token", context });
    const userToken = token || CookieHelper.get({ key: "token", context });

    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };

    return await Fetch.get(`/user/profile/${username}`, _config);
  },
  update: async (
    {
      fname,
      lname,
      date_of_birth,
      city,
      country,
      organization,
      recipient_name,
      recipient_zip_code,
      recipient_country,
      recipient_state,
      recipient_city,
      recipient_address,
      recipient_phone_number,
    }: {
      fname: string;
      lname: string;
      date_of_birth: string;
      city: string;
      country: string;
      organization: string;
      recipient_name: string;
      recipient_zip_code: string;
      recipient_country: string;
      recipient_state: string;
      recipient_city: string;
      recipient_address: string;
      recipient_phone_number: string;
    },
    context = null
  ) => {
    const userToken = CookieHelper.get({ key: "token", context });

    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };

    const data = {
      fname: fname,
      lname: lname,
      date_of_birth: date_of_birth,
      city: city,
      country: country,
      organization: organization,
      recipient_name: recipient_name,
      recipient_zip_code: recipient_zip_code,
      recipient_country: recipient_country,
      recipient_state: recipient_state,
      recipient_city: recipient_city,
      recipient_address: recipient_address,
      recipient_phone_number: recipient_phone_number,
    };

    return await Fetch.patch(`/user`, data, _config);
  },
  updateAvatar: async (data: any, context = null) => {
    const userToken = CookieHelper.get({ key: "token", context });

    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
        "content-type": "multipart/form-data",
      },
    };

    return await Fetch.patch(`/user/avatar`, data, _config);
  },
  //
  create: async (
    {
      fname,
      lname,
      username,
      email,
      role_id,
    }: {
      fname: string;
      lname: string;
      username: string;
      email: string;
      role_id: number;
    },
    context: any = null
  ) => {
    const userToken = CookieHelper.get({ key: "token", context });

    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };
    const data = {
      fname: fname,
      lname: lname,
      username: username,
      email: email,
      role_id: role_id,
    };

    return await Fetch.post(`/user`, data, _config);
  },
  // TODO
  confirm: async (
    {
      id,
      token,
      email,
      password,
    }: { id: number; token: string; email: string; password: string },
    context: any = null
  ) => {
    const userToken = CookieHelper.get({ key: "token", context });

    const _config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };

    const data = {
      id: id,
      token: token,
      email: email,
      password: password,
    };

    return await Fetch.patch(`/user/${id}/password`, data, _config);
  },
};
