"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveCookies } from "./action";

export default function OAuthCallback() {
  const [isLoading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(200);
  const [errorMessage, setErrorMessage] = useState("Bad request");

  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  console.log(code);

  useEffect(() => {
    fetch("http://localhost:8000/auth/oauth/token", {
      method: "POST",
      body: JSON.stringify({ code: code }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        async (data: {
          error: number;
          message: string;
          data: { accessToken: string; refreshToken: string };
        }) => {
          if (data?.error) {
            setErrorStatus(data?.error);
            setErrorMessage(data?.message);
          }

          if (data?.data?.accessToken) {
            await saveCookies(data.data.accessToken, data.data.refreshToken);
          }

          setLoading(false);
        }
      );
  }, []);

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div
          className="inline-block h-24 w-24 animate-spin rounded-full border-l-gray-700 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
            Error {errorStatus}
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
            {errorMessage}
          </p>
          <Link href="/">
            <button className="inline-flex text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">
              Back to Homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
