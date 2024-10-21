"use client";

import { Reorder } from "framer-motion";
import { useState } from "react";

const Analytics = () => {
  const [items, setItems] = useState([0, 1, 2, 3]);

  return (
    <div className="flex flex-col h-full gap-10 my-6 mx-3 sm:mx-12 overflow-y-auto">
      <Reorder.Group axis="y" values={items} onReorder={setItems}>
        {items.map((item) => (
          <Reorder.Item key={item} value={item}>
            {item}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default Analytics;
