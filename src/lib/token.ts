import { UnauthorizedError } from "@/common/errors/";

export const getToken = () => {
  const token = sessionStorage.getItem("AccessToken");
  if (token) {
<<<<<<< HEAD
    console.log(token);
    const d = Buffer.from(token.split(".")[1], "base64").toString("ascii");
    console.log(d, JSON.parse(d));
=======
    //console.log(token);
    const d = Buffer.from(token.split(".")[1], "base64").toString("ascii");
   // console.log(d, JSON.parse(d));
>>>>>>> d1452b7 (Initial commit)
    return JSON.parse(d);
  }
  throw new UnauthorizedError("Please Log in");
};
