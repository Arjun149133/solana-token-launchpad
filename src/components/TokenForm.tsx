import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

type FormData = {
  name: string;
  symbol: string;
  image_url: string;
  initial_supply: number;
};

const TokenForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    symbol: "",
    image_url: "",
    initial_supply: 0,
  });

  const createToken = () => {};

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className=" w-1/3 space-y-2">
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name}
          placeholder="Name"
          onChange={onInputChange}
          name="name"
        />
      </div>
      <div>
        <Label>Symbol</Label>
        <Input
          value={formData.symbol}
          placeholder="Symbol"
          onChange={onInputChange}
          name="symbol"
        />
      </div>
      <div>
        <Label>Image</Label>
        <Input
          placeholder="Image URL"
          value={formData.image_url}
          onChange={onInputChange}
          name="image_url"
        />
      </div>
      <div>
        <Label>Initial Supply</Label>
        <Input
          value={formData.initial_supply}
          placeholder="Initial Supply"
          onChange={onInputChange}
          name="initial_supply"
        />
      </div>
      <div className=" flex justify-center p-2">
        <Button variant="secondary" onClick={createToken}>
          Create a Token
        </Button>
      </div>
    </form>
  );
};

export default TokenForm;
