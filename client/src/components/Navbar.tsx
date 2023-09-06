import { User, logoutUserAsync, selectUser } from '../redux/authSlice';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { RootState } from '../app/store';
import Dropdown from './Dropdown';
import Paragraph from './Paragraph';

export default function Navbar() {
    const user: User | null = useSelector<RootState, User | null>(selectUser);

    return (
        <div>
            <nav className="bg-pri-200 p-4">
                <div className="container mx-auto flex justify-between items-center bg-pri-200">
                    <Link to="/" className="text-white text-2xl font-bold">
                        Discover
                    </Link>
                    <div className="space-x-4">
                        {user ? (

                            <Dropdown
                                items={[{
                                    element: <><FiLogOut /><Paragraph text="Logout" /></>,
                                    onClick: () => {
                                        logoutUserAsync();
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