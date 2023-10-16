import { User, useAuth } from '../contexts/AuthContext';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import Dropdown from './Dropdown';
import Paragraph from './Paragraph';
import Search from './Search';
import LoadingAnimation from './LoadingAnimation';

export default function Navbar() {
    const { state, logoutUser } = useAuth();
    const user: User | undefined = state.user;

    return (
        <div>
            <nav className="bg-pri-200 py-3 text-white ">
                <div className="mx-auto flex justify-between items-center w-[90%]">
                    <Link to="/" className="text-2xl font-bold">
                        Discover
                    </Link>
                    <div className="flex space-x-4">
                        <Search />
                        {user ? (

                            <Dropdown
                                items={[{
                                    element: <><FiLogOut /><Paragraph text="Logout" /></>,
                                    onClick: () => {
                                        logoutUser();
                                    },
                                },
                                ]}
                                triggerElement={<><FiUser /><Paragraph text={user.username} /></>}
                            />
                        ) : (
                            state.loading ? (
                                <div className='flex justify-center items-center gap-3'>
                                    <FiUser />
                                    <LoadingAnimation />
                                </div>
                                
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