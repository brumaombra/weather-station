import { defineEventHandler, readBody, setCookie } from "h3";

export default defineEventHandler(async event => {
    const { token } = await readBody(event);
    setCookie(event, "auth_token", token, {
        httpOnly: true,
        secure: true,
        path: "/"
    });

    return { message: "Cookie set successfully" };
});