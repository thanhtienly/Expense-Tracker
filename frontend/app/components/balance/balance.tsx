"use client";

import { useEffect, useState } from "react";
import { getCookies } from "./action";

function percentageHexColor(percentage: number) {
  if (percentage >= 0) {
    return "bg-[#16A001]";
  }

  return "bg-[#A70000]";
}

function numberToConcurrency(n: number) {
  return new Intl.NumberFormat().format(n).replace("-", "– ") + " VNĐ";
}

function numberToPercentageFormat(n: number) {
  if (n >= 0) {
    return `+${n}%`;
  }

  return `-${Math.abs(n)}%`;
}

async function getWalletBalance() {
  const token = await getCookies();
  const accessToken = token["accessToken"];

  const response: {
    message: string;
    data: {
      currentBalance: number;
      previousBalance: number;
    };
  } = await fetch("http://localhost:8000/balance/wallet/bank", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());
  return response.data;
}

export default function Balance() {
  const [isLoading, setLoading] = useState(true);
  const [currentMonthBalance, setCurrBalance] = useState(0);
  const [previousMonthBalance, setPrevBalance] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWalletBalance();

      setCurrBalance(data["currentBalance"]);
      setPrevBalance(data["previousBalance"]);

      let changed = Math.floor(
        ((data["currentBalance"] - data["previousBalance"]) /
          data["previousBalance"]) *
          100
      );

      setPercentChange(changed);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return;
  }

  return (
    <div
      id="statistic"
      className="p-2 flex flex-row items-start justify-start overflow-x-scroll overscroll-x-contain no-scrollbar"
    >
      <div className="flex flex-col justify-center items-start bg-[#94DFFF] min-w-[200] p-2 rounded-xl">
        <p className="font-semibold">Bank Amount</p>
        <p className="font-medium italic">
          {numberToConcurrency(currentMonthBalance)}
        </p>
        <div className="w-full flex justify-end">
          <p
            className={`text-end p-1 ${percentageHexColor(
              percentChange
            )} rounded-md font-medium text-white`}
          >
            {numberToPercentageFormat(percentChange)}
          </p>
        </div>
      </div>
    </div>
  );
}
