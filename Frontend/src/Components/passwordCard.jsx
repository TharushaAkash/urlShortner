import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { ImSpinner } from "react-icons/im";
import { TbFidgetSpinnerFilled } from "react-icons/tb";
import { MdErrorOutline } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";


export default function PasswordCard(){

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    async function handleSubmit() {
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URI}/${shortUrl}`, 
                {
                    password: password
                }
            )

            if(response){
                setTimeout(() => {
                }, 2000)
            }

        }catch(err){
            toast.error(err.response.data.message)
        }finally {
            setLoading(false);
        }
    }

    return(
        <div className="flex h-screen">
            <div className="w-full min-h-screen bg-slate-800 flex justify-center items-center">

                {/* password form */}
                <div className="p-6 sm:p-8 border border-slate-700 bg-slate-900 rounded-4xl">

                    <div className="flex flex-col justify-center items-center">

                        {/* logo background */}
                        <div className="flex w-16 h-16 bg-amber-900/30 rounded-full justify-center items-center mt-4 mb-4">
                            <FaLock  className="text-2xl text-amber-400"/>
                        </div>
                        <h1 className="text-white font-bold text-2xl mb-3">Password Protected</h1>
                        <p className="text-slate-500 mb-6">The link requires a password to access..</p>

                    </div>

                    <label className="text-slate-500 flex mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        onChange={handlePassword}
                        className="flex bg-slate-800 mb-4 px-5 py-4 w-full rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                    </input>

                    <button
                        onClick={handleSubmit} 
                        className="flex gap-3 bg-[#2754f4] w-full s:w-[150px] mx-auto px-6 py-4  items-center justify-center rounded-2xl  text-white cursor-pointer hover:bg-transparent hover: border-2 hover: border-blue-600 hover:transition-all"
                        >
                        {loading ? (
                            <>
                            Unlocking
                            <TbFidgetSpinnerFilled className="text-xl animate-spin"/>
                            </>
                        ) : (
                            <>
                            Unlock Link
                            <FaUnlockAlt />
                            </>
                        )

                        }
                        
                    </button>
                    {/* password Error */}

                    {error && (
                        <div className="flex gap-3 w-full bg-red-900/30 border-2 border-red-800 mt-6 px-6 py-4 rounded-2xl justify-center items-center">
                        <MdErrorOutline  className="text-2xl text-red-300"/>
                        <p className="text-red-300">{response.data.message}</p>
                    </div>

                    )}
                    
                </div>
            

            </div>


        </div>
    )
}