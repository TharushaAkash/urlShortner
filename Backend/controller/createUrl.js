import { nanoid } from "nanoid";
import Url from "../model/url.js";

// Create short URL
export async function createUrl(req, res) {
  try {
    const { long_url, expireAt, isPassword, password } = req.body;
    const date = new Date(expireAt);
    console.log(`type of before: ${typeof expireAt}`)
    console.log(`type of: ${typeof date}`);
    const d = new Date("2026-05-21")
    console.log(d instanceof Date);
    console.log(date instanceof Date)

    // Basic validation
    if (!long_url) {
      return res.status(400).json({message: "Url is required.."});
    }

    if(isNaN(date.getTime())){
      return res.status(400).json({message: "Invalid date format"});
    }

    

    const short_url = nanoid(5);

    // Convert expire time to number
    // const exTime = Number(expireAt);

    // Calculate expiry date if valid
    // const expireDate =
    //   !isNaN(date) && date > 0
    //     ? new Date(Date.now() + exTime * 60 * 1000)
    //     : null;

    // Save URL
    await Url.create({
      long_url,
      short_url,
      expireAt: date,
      isPassword,
      password
    });

    // Send response (dynamic)
    return res.status(201).json({
      url: `${process.env.BASE_URL}/${short_url}`,
      message: "Url created successfully",
      ...(date && {
        expire: `The link will expire on ${date}`,
      }),
      ...(isPassword && {
        password: `Password: ${password}`
      })
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