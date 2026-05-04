import { nanoid } from "nanoid";
import Url from "../model/url.js";

// Create short URL
export async function createUrl(req, res) {
<<<<<<< HEAD
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
=======
  try {
    const { long_url, expireAt } = req.body;
>>>>>>> d73ebaee7dd66dab82a23328b480bfd60de20cf4

    // Basic validation
    if (!long_url) {
      return res.status(400).json({ message: "long_url is required" });
    }

    const short_url = nanoid(5);

    // Convert expire time to number
    const exTime = Number(expireAt);

    // Calculate expiry date if valid
    const expireDate =
      !isNaN(exTime) && exTime > 0
        ? new Date(Date.now() + exTime * 60 * 1000)
        : null;

    // Save URL
    await Url.create({
      long_url,
      short_url,
      expireAt: expireDate,
    });

    // Send response (dynamic)
    return res.status(201).json({
      url: `${process.env.BASE_URL}/${short_url}`,
      message: "Url created successfully",
      ...(expireDate && {
        expire: `The link will expire in ${exTime} minutes`,
      }),
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}


// Redirect to original URL
export async function redirectUrl(req, res) {
  try {
    const { short_url } = req.params;

    const url = await Url.findOne({ short_url });

    // Not found
    if (!url) {
      return res.status(404).json({
        message: "Url not found",
      });
    }

    // Expired
    if (url.expireAt && new Date() > url.expireAt) {
      return res.status(404).json({
        message: "Url is expired",
      });
    }

    // Redirect
    return res.redirect(url.long_url);

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}