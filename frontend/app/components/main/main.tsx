import Balance from "../balance/balance";

export default function Main() {
  return (
    <div
      className="w-full basic-full h-screen bg-white p-4 flex flex-col overflow-hidden"
      id="main"
    >
      <Balance></Balance>
    </div>
  );
}
