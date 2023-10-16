import { User, logoutUserAsync, selectUser } from '../redux/authSlice';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { AppDispatch, RootState } from '../app/store';
import Dropdown from './Dropdown';
import Paragraph from './Paragraph';
import Search from './Search';

export default function Navbar() {
    const dispatch = useDispatch<AppDispatch>();
    const user: User | undefined = useSelector<RootState, User | undefined>(selectUser);

    return (
        <div>
            <nav className="bg-pri-200 py-3">
                <div className="mx-auto flex justify-between items-center w-[90%]">
                    <Link to="/" className="text-white text-2xl font-bold">
                        Discover
                    </Link>
                    <div className="flex space-x-4">
                        <Search />
                        {user ? (

                            <Dropdown
                                items={[{
                                    element: <><FiLogOut /><Paragraph text="Logout" /></>,
                                    onClick: () => {
                                        dispatch(logoutUserAsync());
                                    },
                                },
                                ]}
                                triggerElement={<><FiUser /><Paragraph text={user.username} /></>}
                            />
                        ) : (
                            <Link to="/auth" className="flex items-center gap-1 text-sec-200 font-bold">
                                Login
                                <FiLogIn />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}