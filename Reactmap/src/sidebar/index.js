import React, { useContext } from "react";

import { CollapseContext } from "../App";
import { LIST_WARD } from "../constants/constants";

export default function Sidebar() {
  const { value, setValue } = useContext(CollapseContext);
  const handleChange = (item) => {
    setValue(item.id);
  };
  return (
    <div className="h-screen w-96 bg-gray-500 text-white">
      <div className="text-center text-2xl font-bold mt-8">
        Cửa hàng tạp hóa quận Bắc Từ Liêm
      </div>
      <div className="mt-4">
        {LIST_WARD.map((item) => (
          <div
            key={item.id}
            onClick={() => handleChange(item)}
            className={`${
              item.id === value ? "bg-white text-gray-700" : ""
            } px-4 py-2 cursor-pointer`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
