"use client";
import { deleteCookies, getCookies } from "./action";

function minimizeSideBar() {
  var elementToHide = document.querySelectorAll(".minimize");
  elementToHide.forEach((ele) => {
    ele.classList.add("lg:hidden");
  });

  var sidebar = document.querySelector("#sidebar");
  var maximizeButton = document.querySelector("#maximize");

  sidebar?.classList.remove("lg:w-1/5");
  maximizeButton?.classList.remove("hidden");
}

function maximizeSideBar() {
  var elementToShow = document.querySelectorAll(".minimize");
  elementToShow.forEach((ele) => {
    ele.classList.remove("lg:hidden");
  });

  var sidebar = document.querySelector("#sidebar");
  var maximizeButton = document.querySelector("#maximize");

  sidebar?.classList.add("lg:w-1/5");

  maximizeButton?.classList.add("hidden");
}

async function logUserOut() {
  const token = await getCookies();
  const accessToken = token["accessToken"];

  fetch("http://localhost:8000/auth/log-out", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());
  return await deleteCookies();
}

export default function Sidebar() {
  return (
    <div
      className="w-fit lg:w-1/5 h-screen bg-[#E2F5FE] p-2 flex flex-col"
      id="sidebar"
    >
      <div className="basis-full flex flex-col">
        <div className="row m-1 flex flex-row items-center">
          <div className="h-full flex flex-row items-center minimize">
            <button className="p-2 bg-white rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                width="24"
                height="24"
                fill="#011c47"
              >
                <path d="M64 32C28.7 32 0 60.7 0 96L0 256 0 416c0 35.3 28.7 64 64 64l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 416l0-128 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 224 64 96l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 32z" />
              </svg>
            </button>
          </div>
          <div className="basis-full h-full flex flex-row items-center justify-end hidden lg:flex">
            <button
              id="minimize"
              className="p-2 hover:bg-white cursor-pointer rounded-sm minimize"
              onClick={minimizeSideBar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="24"
                height="24"
                fill="#011c47"
              >
                <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z" />
              </svg>
            </button>
            <button
              id="maximize"
              className="p-2 hover:bg-white cursor-pointer rounded-sm hidden"
              onClick={maximizeSideBar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="24"
                height="24"
                fill="#011c47"
              >
                <path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="row m-1 flex flex-row items-center rounded-sm cursor-pointer hover:bg-white w-fit lg:w-auto">
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width="24"
              height="24"
              fill="#011c47"
              className="cursor-pointer"
            >
              <path d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z" />
            </svg>
          </button>
          <p className="ml-2 minimize hidden lg:block">Analytic</p>
        </div>
        <div className="row m-1 flex flex-row items-center rounded-sm cursor-pointer hover:bg-white w-fit lg:w-auto">
          <button className="p-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width="24"
              height="24"
              fill="#011c47"
              className="cursor-pointer"
            >
              <path d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64l241.9 0c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5 608 384c0 35.3-28.7 64-64 64l-241.9 0c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5 32 128c0-35.3 28.7-64 64-64zm64 64l-64 0 0 64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64l64 0 0-64zM320 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z" />
            </svg>
          </button>
          <p className="ml-2 minimize hidden lg:block">Transaction</p>
        </div>
      </div>
      <div className="relative inline-block text-left">
        <div
          className="row flex flex-row items-center rounded-sm cursor-pointer hover:bg-white w-fit lg:w-full"
          onClick={logUserOut}
        >
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="24"
              height="24"
              fill="#011c47"
              className="cursor-pointer"
            >
              <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
            </svg>
          </button>
          <p className="ml-2 minimize hidden lg:block">Log out</p>
        </div>
      </div>
    </div>
  );
}
