import express from "express";
import { checkPassword, createUrl, redirectUrl } from "../controller/createUrl.js";

const url_router = express.Router();

url_router.post('/', createUrl);
url_router.get('/:short_url', redirectUrl);
url_router.post('/:shortUrl', checkPassword);

export default url_router;