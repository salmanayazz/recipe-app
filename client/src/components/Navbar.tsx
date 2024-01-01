import { User, useAuth } from "../contexts/auth/AuthContext";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { FiUser, FiLogOut, FiLogIn, FiPlus } from "react-icons/fi";
import Dropdown from "./Dropdown";
import Paragraph from "./Paragraph";
import Search from "./Search";
import LoadingAnimation from "./LoadingAnimation";

export default function Navbar() {
  const { authState, logoutUser } = useAuth();
  const user: User | undefined = authState.user;

  return (
    <nav className="flex justify-center items-center bg-pri-200 py-3 text-white sticky top-0 z-2">
      <div className="flex justify-between items-center w-[90%]">
        <div className="flex flex-1 justify-between space-x-4 gap-6">
          <Search />
          {authState.loading ? (
            <div className="flex justify-center items-center gap-3">
              <FiUser />
              <LoadingAnimation />
            </div>
          ) : user ? (
            <Dropdown
              items={[
                {
                  element: (
                    <div className="flex justify-center items-center gap-2">
                      <FiLogOut />
                      <p>Logout</p>
                    </div>
                  ),
                  onClick: () => {
                    logoutUser();
                  },
                },
                {
                  element: (
                    <NavLink
                      to="create"
                      className="flex justify-center items-center gap-2"
                    >
                      <FiPlus />
                      <p className="whitespace-nowrap">Create Recipe</p>
                    </NavLink>
                  ),
                },
              ]}
              triggerElement={
                <>
                  <FiUser />
                  <Paragraph text={user.username} />
                </>
              }
            />
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1 text-sec-200 font-bold"
            >
              Login
              <FiLogIn />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
