import { AiOutlineMenu } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "../../../lib/auth";

export default function Header({ setExpand }) {
    const { signOut } = useAuth()

    return (
        <header className="h-14 fixed top-0 w-screen z-40 bg-white flex">
            <div className="w-64 flex justify-between items-center h-full p-4 flex-shrink-0">
                <div>Logo</div>
                <button onClick={setExpand}
                    className="w-8 h-8 rounded-lg transition-colors text-indigo-500
                bg-admin flex-center">
                    <AiOutlineMenu />
                </button>
            </div>
            <div className="flex-auto flex justify-end p-4">
                <button className="px-2 text-indigo-700 flex-center">
                    <BiLogOut onClick={signOut} />
                </button>
            </div>
        </header>
    )
}