import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { DBResponse } from "./DBResponse";
import { NextRequest } from "next/server";
import { USER_COOKIE_KEY } from "../models/User";

export const UserCookieHandler = {
  get: async (
    request?: NextRequest
  ): Promise<DBResponse<UserCookie | undefined>> => {
    try {
      let cookieData: string | undefined = undefined;
      if (request) {
        cookieData = request.cookies.get(USER_COOKIE_KEY)?.value;
      } else {
        await getCookie(USER_COOKIE_KEY);
      }


      console.error("User: ", cookieData && JSON.parse(cookieData))
      return {
        success: true,
        data: cookieData && JSON.parse(cookieData),
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed: " + error,
      };
    }
  },

  save: async (userType: string, token: string): Promise<DBResponse<never>> => {
    try {
      const data: UserCookie = {
        userType: userType,
        token: token,
      };
      await setCookie(USER_COOKIE_KEY, JSON.stringify(data), {
        maxAge: 60 * 60 * 24 * 7,
      });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed: " + error,
      };
    }
  },

  delete: async (): Promise<DBResponse<never>> => {
    try {
      await deleteCookie(USER_COOKIE_KEY);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed: " + error,
      };
    }
  },
};

type UserCookie = {
  userType: string;
  token: string;
};
