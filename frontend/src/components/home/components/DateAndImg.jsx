import Image from "next/image";

export const DateAndImg = ({ nombre, apellido }) => {
  return (
    <>
      <div className="absolute w-[261px] h-[52px] left-[7px] top-[70px] bg-white overflow-hidden rounded-tl-[10px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[10px] outline outline-1 outline-[#718EBF]">
        <div className="absolute w-[213px] left-[31px] top-[5px] flex justify-center items-center gap-[50px]">
          <Image
            src="/logo.png"
            alt="Logo InnovaLab"
            width={130}
            height={130}
            priority
          />
          <div className="w-[106px] flex justify-center items-center gap-[10px]">
            <div className="text-center text-black/25 text-base font-normal leading-6">
              {nombre || "Usuario"} {apellido || ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};