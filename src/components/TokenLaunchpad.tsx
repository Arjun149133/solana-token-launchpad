import TokenForm from "./TokenForm";

const TokenLaunchpad = () => {
  return (
    <div className=" flex flex-col space-y-7">
      <h1 className=" md:text-xl font-bold w-full flex justify-center">
        Token Launchpad
      </h1>
      <div className=" flex flex-col justify-center items-center">
        <TokenForm />
      </div>
    </div>
  );
};

export default TokenLaunchpad;
