import React from "react";
import { NavLink } from "react-router-dom";
const Header = () => {
  return (
    <div className="flex justify-center p-10">
      <h1 className="text-4xl font-extrabold text-blue-500 mx-6">
        Three Components Fluxgate Magnetometer Software V1.3
      </h1>
      <div
        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
        id="mobile-menu-2"
      >
        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 ${
                  isActive ? "text-blue-700" : "text-grey-700"
                } duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/live"
              className={() =>
                `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              Live
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
