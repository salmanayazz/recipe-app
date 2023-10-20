import { User, useAuth } from '../contexts/AuthContext';
import { NavLink, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiLogIn, FiPlus } from 'react-icons/fi';
import Dropdown from './Dropdown';
import Paragraph from './Paragraph';
import Search from './Search';
import LoadingAnimation from './LoadingAnimation';

export default function Navbar() {
    const { state, logoutUser } = useAuth();
    const user: User | undefined = state.user;

    return (
        <div
            className='flex flex-col h-screen bg-pri-100 text-sec-100'
        >
            <nav className="flex justify-center items-center bg-pri-200 py-3 text-white ">
                <div className="flex justify-between items-center w-[90%]">
                    <div className="flex flex-1 justify-between space-x-4 gap-6">
                        <Search />
                        {state.loading ? (
                            <div className='flex justify-center items-center gap-3'>
                                <FiUser />
                                <LoadingAnimation />
                            </div>
                        ) : (
                            user ? (
                                <Dropdown
                                    items={[{
                                        element:<div    
                                                    className='flex justify-center items-center gap-2'
                                                >
                                                    <FiLogOut />
                                                    <p>
                                                        Logout
                                                    </p>
                                                </div>,
                                        onClick: () => {
                                            logoutUser();
                                        },
                                    }, {
                                        element:<NavLink 
                                                    to="create"
                                                    className='flex justify-center items-center gap-2'
                                                >
                                                    <FiPlus />
                                                    <p
                                                        className='whitespace-nowrap'
                                                    >
                                                        Create Recipe
                                                    </p>
                                                </NavLink>
                                    }]}
                                    triggerElement={<><FiUser /><Paragraph text={user.username} /></>}
                                />
                            ) : (
                                <Link to="/auth" className="flex items-center gap-1 text-sec-200 font-bold">
                                    Login
                                    <FiLogIn />
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}