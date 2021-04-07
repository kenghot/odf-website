import axios from "axios";
import i18n from "i18next";
import { concatQuery } from "./query-string";
export interface IRequestOptions {
  queries?: any;
  body?: {};
}

const request = async (
  method: string,
  endpoint: string,
  options: IRequestOptions
) => {
  let url = "";
  // const logAllow = process.env.NODE_ENV === "development";
  const logAllow = false;
  const { authStore } = require("../modules/auth/AuthModel");
  const accessToken = window.localStorage.getItem("access_token") || "";
  if (logAllow) {
    console.log("======= access token LocalStorage ========", accessToken);
  }
  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      client_id: process.env.REACT_APP_CLIENT_ID || "",
      "request-language": i18n.language === "th" ? "th-TH" : "en-EN",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      uid: authStore.uid || "",
    },
  };

  switch (method) {
    case "GET":
      url = options.queries
        ? `${endpoint}?${concatQuery(options.queries)}`
        : endpoint;
      break;
    case "POST":
      url = endpoint;
      if (options) {
        requestOptions.body = setBody(options.body);
      }
      break;
    case "PUT":
      url = endpoint;
      if (options) {
        requestOptions.body = setBody(options.body);
      }
      break;
    case "DELETE":
      url = endpoint;
      if (options) {
        requestOptions.body = setBody(options.body);
      }
      break;
  }

  try {
    if (logAllow) console.log("url", url, requestOptions);
    const res = await fetch(url, requestOptions);
    if (logAllow) console.log("response:", res);

    if (res.headers.get("x-access-token")) {
      window.localStorage.setItem(
        "access_token",
        res.headers.get("x-access-token") || ""
      );
    }
    // console.log(res);

    const filename = res.headers.get("filename");
    if (res.ok && filename) {
      const data = await res.blob();
      const fUrl = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = fUrl;
      link.setAttribute("download", filename || "file");
      document.body.appendChild(link);
      link.click();
      return;
    }
    const content = res.headers.get("Content-Type");
    if (res.ok && content === "application/ms-excel") {
      const data = await res.blob();
      const fUrl = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = fUrl;
      link.setAttribute(
        "download",
        filename || `report${new Date().toISOString()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      return;
    }
    const resJson = await res.json();
    if (resJson.success) {
      return resJson;
    } else {
      if (logAllow) console.log("=======jsonresponse=====", resJson);
      // eslint-disable-next-line
      throw {
        code: res.status.toString(),
        name: resJson.error.name,
        message: resJson.error.message,
        technical_stack: resJson.error.error_stack,
      };
    }
  } catch (e) {
    if (e.code === "401") {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("posShiftId");
      window.location.href = "/login";
    } else if (e.code === "900") {
      window.localStorage.removeItem("posShiftId");
      window.location.href = window.location.href;
      // window.location.reload();
      throw e;
    } else if (
      e.toString() === "SyntaxError: Unexpected token < in JSON at position 0"
    ) {
      throw {
        code: "",
        name: "พบข้อผิดพลาดจากระบบหลังบ้าน",
        message: "กรุณาติดต่อผู้ดูแลระบบค่ะ",
        technicalStack: "",
      };
    }
    throw e;
  }
};

const requestForm = async (
  method: string = "POST" || "PUT",
  endpoint: string,
  body: FormData
) => {
  const logAllow = process.env.NODE_ENV === "development";
  const { authStore } = require("../modules/auth/AuthModel");
  const accessToken = window.localStorage.getItem("access_token") || "";
  if (logAllow) {
    console.log("======= access token LocalStorage ========", accessToken);
  }

  const requestOptions: any = {
    headers: {
      "Content-Type": "multipart/form-data",
      client_id: process.env.REACT_APP_CLIENT_ID || "",
      "request-language": i18n.language === "th" ? "th-TH" : "en-EN",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      uid: authStore.uid || "",
    },
  };

  try {
    if (logAllow) console.log("url", endpoint, requestOptions);

    let res: any = {};
    switch (method) {
      case "POST":
        res = await axios.post(endpoint, body, requestOptions);
        break;
      case "PUT":
        res = await axios.put(endpoint, body, requestOptions);
        break;
    }

    if (logAllow) console.log("response:", res);

    const resJson = res.data;
    if (resJson.success) {
      return resJson;
    } else {
      if (logAllow) console.log("=======jsonresponse=====", resJson);
      // eslint-disable-next-line
      throw {
        code: res.status.toString(),
        name: resJson.error.name,
        message: resJson.error.message,
        technical_stack: resJson.error.error_stack,
      };
    }
  } catch (e) {
    const resJson = e.response;
    if (resJson.status === 400) {
      throw {
        code: resJson.status.toString(),
        name: resJson.data.error.name,
        message: resJson.data.error.message,
        technical_stack: resJson.data.error.error_stack,
      };
    } else if (resJson.status === 404) {
      throw {
        code: resJson.status.toString(),
        name: resJson.data.error.name,
        message: resJson.data.error.message,
        technical_stack: resJson.data.error.error_stack,
      };
    } else {
      throw e;
    }
  }
};

const setBody = (body: any) => {
  return JSON.stringify(body);
};
const get = (endpoint: string, requestOptions: IRequestOptions) =>
  request("GET", endpoint, requestOptions);
const post = (endpoint: string, requestOptions: IRequestOptions) =>
  request("POST", endpoint, requestOptions);
const put = (endpoint: string, requestOptions: IRequestOptions) =>
  request("PUT", endpoint, requestOptions);
const remove = (endpoint: string, requestOptions: IRequestOptions) =>
  request("DELETE", endpoint, requestOptions);

const formPut = (endpoint: string, body: FormData) =>
  requestForm("PUT", endpoint, body);
const formPost = (endpoint: string, body: FormData) =>
  requestForm("POST", endpoint, body);
export default { get, post, put, delete: remove, formPut, formPost };
