import React from "react";
import { Input } from "./ui/input";

const ImageUpload = ({ image, setImage }: { image: any; setImage: any }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="">
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <div>
          <h3>Preview:</h3>
          <img
            src={image as string}
            alt="Preview"
            className=" w-fit h-fit bg-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
