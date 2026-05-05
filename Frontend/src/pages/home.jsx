import { useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import Header from "../Components/header";
import axios from "axios";
import toast from "react-hot-toast";
import { Atom } from "react-loading-indicators";
import { MdOutlineElectricBolt } from "react-icons/md";
import { HiOutlineLink } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";



export default function HomePage() {

    const [url, setUrl] = useState("");
    const [showModel, setShowModel] = useState(false)
    const [loading, setLoading] = useState(false);
    const [expireAt, setExpireAt] = useState("");
    const [openSetting, setOpenSetting] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [password, setPassword] = useState("");


    const handleChange = (e) => {
        setUrl(e.target.value);
    }

    const handleTime = (e) => {
        setExpireAt(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleCheckbox = (e) => {
        setIsPassword(e.target.checked)
    }



    async function handleSubmit() {
        try {
            setLoading(true);
            console.log(`url is: ${url}`)
            console.log(`expire is: ${expireAt}`) //Dubugging purpose

            const response = await axios.post(import.meta.env.VITE_API_URI,
                {
                    long_url: url,
                    expireAt: expireAt,
                    isPassword: isPassword,
                    ...(isPassword && {
                        password: password
                    }),
                    ...(expireAt && {
                        expireAt: expireAt
                    })
                }
            )

            // // If expire is null not display expire msg
            // if (response.data.expire == null) {
            //     setUrl(response.data.url)
            //     setTimeout(() => {
            //         setShowModel(true);
            //         toast.success(response.data.message);
            //         toast.success(response.data.password)
            //     }, 1000);
            //     return;

            // }
            //Else display expire msg as well
            if (response) {
                console.log(`url: ${response.data.url}`)
                console.log(`expire: ${response.data.expire}`)
                
                setUrl(response.data.url)
                setTimeout(() => {
                    setShowModel(true);
                    if(response.data.expire){
                        toast.success(response.data.expire);
                    }
                    toast.success(response.data.message);
                }, 1000);


            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "An error occurred");

        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);  //1 second timeout added for better smooth loading animation
        }

    }

    return (
        <div className="flex h-screen">

            {/* loading screen */}

            {loading && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                    <Atom text="Getting URL...." style={{ fontSize: "30px", color: "#ffffff", fontWeight: "bold" }} color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} speedPlus="-2" />
                </div>
            )}

            {/* popup model */}
            {showModel && (
                <div className="flex inset-0 fixed bg-accent justify-center items-center z-50 px-4">

                    {/* popup Card */}
                    <div className="w-full max-w-[400px] bg-white text-center rounded-xl p-3 relative">
                        <h2 className="font-bold text-2xl text-[#05df72] mt-2">Shotend URL</h2>


                        {/* Close button */}
                        <button
                            onClick={() => {
                                setShowModel(false);
                                setUrl("");
                            }}
                            className="absolute top-2 right-3 text-3xl text-red-500 cursor-pointer hover:text-red-600"
                        >
                            <IoCloseCircleSharp />
                        </button>


                        <input
                            value={url}
                            readOnly
                            className="w-full bg-amber-200 border rounded-md p-2 mt-6 border-dashed border-[#2F2FE4] focus:outline-none"
                        />


                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(url);
                                setShowModel(false);
                                setUrl("");
                                setExpireAt("");
                                toast.success("URL Copied!");
                            }
                            }
                            className="w-[100px] bg-[#2F2FE4] rounded-xl p-2 mt-3 text-white font-bold cursor-pointer hover:bg-transparent hover:text-[#2F2FE4] hover:border-2 hover:border-[#2F2FE4]"
                        >
                            Copy URL
                        </button>


                    </div>

                </div>
            )}




            <Header />
            {/* background */}
            <div className="w-full min-h-screen bg-second flex flex-col justify-center items-center pt-24 px-4 sm:px-6">

                {/* Badge */}
                <div className="text-[#8ec5ff] mt-10 bg-[#1b3061] w-auto px-4 py-2 rounded-2xl flex gap-3 justify-center items-center">
                    <MdOutlineElectricBolt />
                    <h2 className="font-bold text-[#8ec5ff] text-sm sm:text-base">Fast & Free URL Shortener</h2>
                </div>

                {/* Hero text */}
                <div className="flex flex-col justify-center items-center mb-10 mt-8 text-center">
                    <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-center">
                        <span className="text-white">Free URL Shortner</span><br />
                        <span className="text-[#175cfb]">Shorten Links Instantly </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-500 mt-5 text-center w-full max-w-[700px]">
                        Create short, memorable URLs in seconds. Track clicks with detailed analytics,
                        generate QR codes
                        and manage all your links in one place — completely free.
                    </p>
                </div>

                {/* Input and button box */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full max-w-[600px]">

                    <div className="w-full relative">
                        <input
                            type="text"
                            placeholder="Paste your long url here.."
                            value={url}
                            name="url"
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-800 text-white px-5 py-4 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        </input>

                        <div className="text-slate-400 font-bold absolute right-4 top-1/2 -translate-y-1/2">
                            <HiOutlineLink />
                        </div>
                    </div>


                    <button
                        onClick={handleSubmit}
                        className="flex gap-3 bg-[#2158f8] rounded-2xl items-center justify-center w-full sm:w-[150px] py-4 text-white cursor-pointer hover:bg-transparent hover:border-2 hover:border-[#2158f8] hover:transition-all hover:duration-300 whitespace-nowrap px-4">
                        Shorten URL
                        <FaArrowRight className="font-bold text-lg" />
                    </button>


                </div>


                {/* Advanced Settings toggle */}
                <div className="flex gap-2 items-center mt-5 justify-center text-[#8dc4f2] cursor-pointer">
                    {openSetting ? <FaArrowUp /> : <FaArrowDown />}
                    <button className="text-[#8dc4f2] cursor-pointer"
                        onClick={() => {
                            openSetting ? setOpenSetting(false) : setOpenSetting(true);
                        }}>Advance Settings</button>
                </div>


                {openSetting && (
                    <div className="mt-4 bg-slate-800 rounded-2xl p-6 w-full max-w-[600px]">
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full justify-center">

                            {/* Password Protection */}
                            <div className="w-full sm:w-1/2">
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="checkbox"
                                        onChange={handleCheckbox}
                                        className="scale-150 cursor-pointer"
                                    ></input>
                                    <label className="text-white">Password Protection</label>
                                </div>
                                <input
                                    type="password"
                                    disabled={!isPassword}
                                    autoComplete="off"
                                    placeholder="Enter password"
                                    onChange={handlePassword}
                                    className={`w-full px-4 py-2 border border-slate-600 rounded-2xl bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPassword ? 'cursor-text' : 'cursor-not-allowed'}`}
                                ></input>
                            </div>

                            {/* Expiration Time */}
                            <div className="w-full sm:w-1/2">
                                <div className="flex items-center mb-3">
                                    <label className="text-white">Expiration Time</label>
                                </div>
                                <input
                                    type="datetime-local"
                                    onChange={handleTime}
                                    className="w-full px-4 py-2 border border-slate-600 rounded-2xl bg-slate-700 text-white"

                                ></input>
                            </div>

                        </div>


                    </div>
                )}

            </div>

        </div>

    )
}
