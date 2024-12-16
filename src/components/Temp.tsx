import { useState } from "react";
import ImageUpload from "./ImageUpload";

const Temp = () => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  return (
    <div>
      <ImageUpload image={image} setImage={setImage} />
    </div>
  );
};

export default Temp;
