import { IoFastFoodOutline } from 'react-icons/io5';
import profile from '../../assets/img.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/login");                // redireciona para login
  };

  return (
    <div className="flex w-full bg-gray-50 justify-between border-b-2 border-gray-100 shadow">
      <div className="p-4 flex gap-2 justify-center items-center">
        <IoFastFoodOutline size={18} className="" />
        <h1 className="text-[16px]">Cantina Escolar</h1>
      </div>
      <div className="p-4 flex gap-2 justify-center items-center">
        <img src={profile} alt="" className="text-[16px]" />
        <span
          onClick={handleLogout}
          className="ml-2 cursor-pointer text-red-500 hover:text-red-700 text-[16px]"
        >
          Deslogar
        </span>
      </div>
    </div>
  );
};

export default Header;
