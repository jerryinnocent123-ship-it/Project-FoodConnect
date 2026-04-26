import { CircleArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';





export default function Paiement() {
    const navigate = useNavigate()
    const [input, setInput] = useState({ tel: "", code: "" })
    const [message, setMessage] = useState(null)




    // men fucntion nap mete nan btn nan
    const paid = () => {
        if (input.tel === "" || input.code === "") {
            setMessage("Please fill in the blank spaces");

        } else {
            // a mettre plus tard dasn un state
            setMessage(<Alert severity="success">Payment successfull.</Alert>);
            setInput({ tel: "", code: "" });
            setTimeout(() => {
                navigate("/")
            }, 2000)
        }

    };


    // function pou input yo (onchange)
    const handleChange = (event) => {
        setInput((previousData) => ({
            ...previousData,
            [event.target.name]: event.target.value,
        }));
    };



    return (
        <>
{/* pa retire sa  */}
            <div className="text-left">
                <Link
                    to={"/"}
                    className="flex items-center gap-2 text-2xl font-semibold text-gray-700 hover:text-black"
                >
                    <CircleArrowLeft size={40} />
                    <span>Back</span>
                </Link>
            </div>

                <div>
                    {/* input yo plis btn nan ap anndan la */}
                </div>


            {/* pa retire sa */}
            <div className="text-center bg-green-100 text-green-800 text-xl font-semibold px-4 py-3 rounded-lg shadow-md w-fit mx-auto mt-4">
                {message}
            </div>



        </>
    )
}