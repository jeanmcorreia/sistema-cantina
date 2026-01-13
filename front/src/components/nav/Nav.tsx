import { Link } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { BsBriefcaseFill } from "react-icons/bs";
import { MdShoppingCart } from "react-icons/md";
import { AiFillFund } from "react-icons/ai";



const Nav = () => {
  return <div className="w-2/12 p-4 bg-gray-50 border border-gray-200">
    <ul className="flex flex-col gap-2">
        <li>
            <Link to="/" className="flex justify-start items-center gap-2 hover:bg-gray-400 px-3 py-2 rounded-2xl">
            <IoPersonSharp size={14}/>
            <span className="text-[14px]">Dashboard</span>
            </Link>
        </li>
        <li>
            <Link to="/produtos" className="flex justify-start items-center gap-2 hover:bg-gray-400 px-3 py-2 rounded-2xl">
            <BsBriefcaseFill size={14}/>
            <span className="text-[14px]">Produtos</span>
            </Link>
        </li>
        <li>
            <Link to="/clientes" className="flex justify-start items-center gap-2 hover:bg-gray-400 px-3 py-2 rounded-2xl">
            <MdShoppingCart size={14}/>
            <span className="text-[14px]">Clientes</span>
            </Link>
        </li>
        <li>
            <Link to="/pedidos" className="flex justify-start items-center gap-2 hover:bg-gray-400 px-3 py-2 rounded-2xl">
            <AiFillFund size={14}/>
            <span className="text-[14px]">Vendas</span>
            </Link>
        </li>
    </ul>
  </div>;
};

export default Nav;
