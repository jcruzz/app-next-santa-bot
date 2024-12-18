import Image from "next/image";

const BgNavidad: React.FC = () => {
  return (
    <>
      <div className="window">
        <Image
          src="/SantaBotsito.png"
          alt="BDP"
          width={600}
          height={300}
          priority
        />
      </div>
      <div className="message">
        <h1>Feliz Navidad!</h1>
      </div>
    </>
  );
};

export default BgNavidad;
