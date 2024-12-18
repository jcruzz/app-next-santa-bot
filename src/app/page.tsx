import Image from "next/image";
import BgNavidad from "./components/bg-navidad";
import Chat from "./components/chat";

export default function Home() {
  return (
    <>
      <div className="top-0 absolute">
        <Image
          src="/Fondo Rojo.svg"
          alt="BDP"
          width={500}
          height={300}
          priority
          className="h-screen w-screen select-none z-10"
        />
      </div>
      <div className="p-20">
        <div className="grid grid-cols-3">
          <div className="col-span-1">
            <BgNavidad />
          </div>
          <div className="col-span-2 border-l-4 border-red-400">
            <Chat />
          </div>
        </div>
      </div>
      {/* <div className="bottom-0 absolute w-screen">
      <Image
                src="/footer.png"
                alt="BDP"
                className="z-10"
                width={3000}
                height={300}
                priority
      />
    </div> */}
    </>
  );
}
