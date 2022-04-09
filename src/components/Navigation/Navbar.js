/* eslint-disable */
import { React, useEffect } from "react";

import LogoWhite from "../../assets/images/logo/logo-whit.svg";
import Logo from "../../assets/images/logo/logo-dark.svg";

function Navbar() {
  window.onscroll = function () {
    const ud_header = document.querySelector(".ud-header");
    const sticky = ud_header.offsetTop;
    const logo = document.querySelector(".header-logo");

    if (window.pageYOffset > sticky) {
      ud_header.classList.add("sticky");
    } else {
      ud_header.classList.remove("sticky");
    }

    // ===== logo change
    if (ud_header.classList.contains("sticky")) {
      logo.src = Logo;
    } else {
      logo.src = LogoWhite;
    }

    // ===== how or hide the back-top-top button
    const backToTop = document.querySelector(".back-to-top");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  };

  useEffect(() => {
    // ===== responsive navbar
    let navbarToggler = document.querySelector("#navbarToggler");
    const navbarCollapse = document.querySelector("#navbarCollapse");
    navbarToggler.addEventListener("click", () => {
      navbarToggler.classList.toggle("navbarTogglerActive");
      navbarCollapse.classList.toggle("hidden");
    });

    //===== close navbar-collapse when a  clicked
    document
      .querySelectorAll("#navbarCollapse ul li:not(.submenu-item) a")
      .forEach((e) =>
        e.addEventListener("click", () => {
          navbarToggler.classList.remove("navbarTogglerActive");
          navbarCollapse.classList.add("hidden");
        })
      );

    // ===== Sub-menu
    const submenuItems = document.querySelectorAll(".submenu-item");
    submenuItems.forEach((el) => {
      el.querySelector("a").addEventListener("click", () => {
        el.querySelector(".submenu").classList.toggle("hidden");
      });
    });
  });

  return (
    <div
      className="
      ud-header
      bg-transparent
      absolute
      top-0
      left-0
      z-40
      w-full
      flex
      items-center
    "
    >
      <div className="container">
        <div className="flex -mx-4 items-center justify-between relative">
          <div className="px-4 w-60 max-w-full">
            <a href="index.html" className="navbar-logo w-full block py-5">
              <img src={LogoWhite} alt="logo" className="w-full header-logo" />
            </a>
          </div>
          <div className="flex px-4 justify-between items-center w-full">
            <div>
              <button
                id="navbarToggler"
                className="
                block
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                lg:hidden
                focus:ring-2
                ring-primary
                px-3
                py-[6px]
                rounded-lg
              "
              >
                <span className="relative w-[30px] h-[2px] my-[6px] block bg-white"></span>
                <span className="relative w-[30px] h-[2px] my-[6px] block bg-white"></span>
                <span className="relative w-[30px] h-[2px] my-[6px] block bg-white"></span>
              </button>
              <nav
                id="navbarCollapse"
                className="
                absolute
                py-5
                lg:py-0 lg:px-4
                xl:px-6
                bg-white
                lg:bg-transparent
                shadow-lg
                rounded-lg
                max-w-[250px]
                w-full
                lg:max-w-full lg:w-full
                right-4
                top-full
                hidden
                lg:block lg:static lg:shadow-none
              "
              >
                <ul className="blcok lg:flex">
                  <li className="relative group">
                    <a
                      href="#home"
                      className="
                      ud-menu-scroll
                      text-base text-dark
                      lg:text-white
                      lg:group-hover:opacity-70
                      lg:group-hover:text-white
                      group-hover:text-primary
                      py-2
                      lg:py-6 lg:inline-flex lg:px-0
                      flex
                      mx-8
                      lg:mr-0
                    "
                    >
                      Home
                    </a>
                  </li>
                  <li className="relative group">
                    <a
                      href="#about"
                      className="
                      ud-menu-scroll
                      text-base text-dark
                      lg:text-white
                      lg:group-hover:opacity-70
                      lg:group-hover:text-white
                      group-hover:text-primary
                      py-2
                      lg:py-6 lg:inline-flex lg:px-0
                      flex
                      mx-8
                      lg:mr-0 lg:ml-7
                      xl:ml-12
                    "
                    >
                      About
                    </a>
                  </li>
                  {/* <li className="relative group">
                    <a
                      href="#pricing"
                      className="
                      ud-menu-scroll
                      text-base text-dark
                      lg:text-white
                      lg:group-hover:opacity-70
                      lg:group-hover:text-white
                      group-hover:text-primary
                      py-2
                      lg:py-6 lg:inline-flex lg:px-0
                      flex
                      mx-8
                      lg:mr-0 lg:ml-7
                      xl:ml-12
                    "
                    >
                      Pricing
                    </a>
                  </li> */}
                  <li className="relative group">
                    <a
                      href="#team"
                      className="
                      ud-menu-scroll
                      text-base text-dark
                      lg:text-white
                      lg:group-hover:opacity-70
                      lg:group-hover:text-white
                      group-hover:text-primary
                      py-2
                      lg:py-6 lg:inline-flex lg:px-0
                      flex
                      mx-8
                      lg:mr-0 lg:ml-7
                      xl:ml-12
                    "
                    >
                      Team
                    </a>
                  </li>
                  <li className="relative group">
                    <a
                      href="#contact"
                      className="
                      ud-menu-scroll
                      text-base text-dark
                      lg:text-white
                      lg:group-hover:opacity-70
                      lg:group-hover:text-white
                      group-hover:text-primary
                      py-2
                      lg:py-6 lg:inline-flex lg:px-0
                      flex
                      mx-8
                      lg:mr-0 lg:ml-7
                      xl:ml-12
                    "
                    >
                      Contact
                    </a>
                  </li>
                  {/* <li className="relative group submenu-item">
                    <a
                      href="javascript:void(0)"
                      className="
                      text-base text-dark
                      lg:text-white
                      lg:group-hover:opacity-70
                      lg:group-hover:text-white
                      group-hover:text-primary
                      py-2
                      lg:py-6 lg:inline-flex lg:pl-0 lg:pr-4
                      flex
                      mx-8
                      lg:mr-0 lg:ml-8
                      xl:ml-12
                      relative
                      after:absolute
                      after:w-2
                      after:h-2
                      after:border-b-2
                      after:border-r-2
                      after:border-current
                      after:rotate-45
                      lg:after:right-0
                      after:right-1
                      after:top-1/2
                      after:-translate-y-1/2
                      after:mt-[-2px]
                    "
                    >
                      Pages
                    </a>
                    <div
                      className="
                      submenu
                      hidden
                      relative
                      lg:absolute
                      w-[250px]
                      top-full
                      lg:top-[110%]
                      left-0
                      rounded-sm
                      lg:shadow-lg
                      p-4
                      lg:block lg:opacity-0 lg:invisible
                      group-hover:opacity-100
                      lg:group-hover:visible lg:group-hover:top-full
                      bg-white
                      transition-[top]
                      duration-300
                    "
                    >
                      <a
                        href="about.html"
                        className="
                        block
                        text-sm text-body-color
                        rounded
                        hover:text-primary
                        py-[10px]
                        px-4
                      "
                      >
                        About Page
                      </a>
                      <a
                        href="pricing.html"
                        className="
                        block
                        text-sm text-body-color
                        rounded
                        hover:text-primary
                        py-[10px]
                        px-4
                      "
                      >
                        Pricing Page
                      </a>
                      <a
                        href="contact.html"
                        className="
                        block
                        text-sm text-body-color
                        rounded
                        hover:text-primary
                        py-[10px]
                        px-4
                      "
                      >
                        Contact Page
                      </a>
                      <a
                        href="blog-grids.html"
                        className="
                        block
                        text-sm text-body-color
                        rounded
                        hover:text-primary
                        py-[10px]
                        px-4
                      "
                      >
                        Blog Grid Page
                      </a>
                      <a
                        href="blog-details.html"
                        className="
                        block
                        text-sm text-body-color
                        rounded
                        hover:text-primary
                        py-[10px]
                        px-4
                      "
                      >
                        Blog Details Page
                      </a>
                      <a
                        href="signup.html"
                        className="
                        block
                        text-sm text-body-color
                        rounded
                        hover:text-primary
                        py-[10px]
                        px-4
                      "
                      >
                        Sign Up Page
                      </a>
                      <a
                        href="signin.html"
                        className="
                        block
                        text-sm text-body-color
                        rounded
                        hover:text-primary
                        py-[10px]
                        px-4
                      "
                      >
                        Sign In Page
                      </a>
                      <a
                        href="404.html"
                        className="
                        block
                        text-sm text-body-color
                        rounded
                        hover:text-primary
                        py-[10px]
                        px-4
                      "
                      >
                        404 Page
                      </a>
                    </div>
                  </li> */}
                </ul>
              </nav>
            </div>
            {/* <div className="sm:flex justify-end hidden pr-16 lg:pr-0">
              <a
                href="signin.html"
                className="
                text-base
                font-medium
                text-white
                hover:opacity-70
                py-3
                px-7
                loginBtn
              "
              >
                Sign In
              </a>
              <a
                href="signup.html"
                className="
                text-base
                font-medium
                text-white
                bg-white bg-opacity-20
                rounded-lg
                py-3
                px-6
                hover:bg-opacity-100 hover:text-dark
                signUpBtn
                duration-300
                ease-in-out
              "
              >
                Sign Up
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
