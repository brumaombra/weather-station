import { defineEventHandler, setCookie } from "h3";

export default defineEventHandler(event => {
    setCookie(event, "auth_token", "", { expires: new Date(0) }); // Clear cookie
    return { message: "Logged out successfully" };
});