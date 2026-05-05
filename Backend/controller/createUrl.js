import { nanoid } from "nanoid";
import Url from "../model/url.js";

// Create short URL
export async function createUrl(req, res) {
  try {
    const { long_url, expireAt, isPassword, password } = req.body;
    const date = new Date(expireAt);
   

    // Basic validation
    if (!long_url) {
      return res.status(400).json({ message: "Url is required.." });
    }

    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }


    const short_url = nanoid(5);

    // Save URL
    await Url.create({
      long_url,
      short_url,
      ...(date && {
        expireAt: date
      }),
      ...(isPassword && {
        isPassword: isPassword,
        password: password
      })
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

    if(url.isPassword){
      return res.redirect(`https://th-urls.vercel.app/${short_url}`)
    }

    // Expired
    const expireTime = url.expireAt ? new Date(url.expireAt).getTime() : null;
    if (expireTime && new Date() > expireTime) {
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


export async function checkPassword(req, res) {
  try{
    const shortUrl = req.params.shortUrl;
    const password = req.body.password;

    const url = await Url.findOne({short_url: shortUrl});

    if(!url){
      return res.status(404).json({message: "Url not found"});
    }

    if(url.isPassword && url.password !== password){
      return res.status(401).json({message: "Invalid Password. Try Again.."})
    }

    res.redirect(url.long_url);

  }catch(err){
    res.status(500).json({message: err.message});
  }
}