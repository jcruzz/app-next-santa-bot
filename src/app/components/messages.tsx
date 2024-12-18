"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { IPropsMessages } from "../model";

const Messages: React.FC<IPropsMessages> = ({ data }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrolltoBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrolltoBottom, [data]);

  const addSaltoLinea = (MessageStr: string) => {
    if (MessageStr === null) {
      return;
    }

    if (MessageStr.includes("|")) {
      const str: string[] = MessageStr.split("|");
      return str.map((item) => (
        <span key={Math.random() * Math.random()}>
          {item} <br></br>
        </span>
      ));
    } else {
      return MessageStr;
    }
  };

  return (
    <div>
      {data.map((message) =>
        message.response === "" ? (
          <div
            className="col-start-1 col-end-13 py-1 rounded-lg mb-1"
            key={Math.random()}
          >
            <div className="flex items-center justify-start flex-row-reverse">
              <div className="relative font-normal text-size-14 text-color-black bg-gray-200 py-2 px-4 shadow rounded-xl border border-gray-300">
                {message.request}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="col-start-1 col-end-13 py-1 rounded-lg mb-1"
            key={Math.random() * Math.random()}
          >
            <div className="flex flex-row items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-ful flex-shrink-0">
                <Image
                  src="/3697290.png"
                  className="object-cover h-12 w-12 z-40"
                  alt="BDP"
                  width={600}
                  height={300}
                  priority
                />
              </div>
              <div className="relative ml-3 font-normal text-size-14 text-color-black bg-white py-2 px-4 shadow rounded-xl border border-gray-300">
                <div>{addSaltoLinea(message.response)}</div>
              </div>
            </div>
          </div>
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
