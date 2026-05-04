import { nanoid } from "nanoid";
import Url from "../model/url.js";


//Create short code and save in db 
export async function createUrl(req, res) {
    try {

        const { long_url, expireAt, password } = req.body;

        const short_url = nanoid(5);

        const isPass =
            req.body.isPassword === "true" ||
            req.body.isPassword === "on" ||
            req.body.isPassword === true;

        //Check expire time exist in request body, if exists convert to number
        const exTime = expireAt ? Number(expireAt) : null;

        let expireDate = null;

        //expire time exists and its a number convert to date format
        if (exTime && !isNaN(exTime)) {
            expireDate = new Date(Date.now() + exTime * 60 * 1000)
        }


        await Url.create({
            long_url: long_url,
            short_url,
            expireAt: expireDate,
            password,
            isPassword: isPass
        })

        //If expire time exist, send expire msg as response
        if (exTime) {
            
            res.status(201).json(
                {
                    url: `${process.env.BASE_URL}/${short_url}`,
                    message: "Url created successfully",
                    expire: `The link will expire in  ${req.body.expireAt} minutes`,
                    isPassword: isPass
                }
            )
            return;
        }

        //Not exist expire time send only message and short url
        
        res.status(201).json(
            {
                url: `${process.env.BASE_URL}/${short_url}`,
                message: "Url created successfully",
                isPassword: isPass,
                password: password
            }
        )

    } catch (err) {
        res.status(500).json(
            {
                message: err.message

            });

    }
}


//Verify the url and give the original url
export async function redirectUrl(req, res) {
    try {
        const url = await Url.findOne({ short_url: req.params.short_url })

        if (url) {
            if (url.expireAt && new Date() > url.expireAt) {
                return res.status(404).json(
                    {
                        message: "Url is expired"
                    }
                )
            }
            return res.redirect(url.long_url);
        }

        res.status(404).json(
            {
                message: "Url not found"
            }
        )

    } catch (err) {
        res.status(500).json(
            {
                message: err.message
            }
        )
    }
}