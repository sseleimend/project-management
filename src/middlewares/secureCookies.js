import { cookieOptions } from "../utils/cookieOptions.js";

export const secureCookies = (req, res, next) => {
  const originalCookie = res.cookie;

  res.cookie = function (name, value, options = {}) {
    const secureOptions = { ...cookieOptions, ...options };

    return originalCookie.call(this, name, value, secureOptions);
  };

  next();
};

export default secureCookies;
