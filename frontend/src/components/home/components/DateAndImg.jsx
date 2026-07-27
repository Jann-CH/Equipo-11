export const DateAndImg = ({datos}, url) => {
  return (
    <>
      <div className="absolute w-[261px] h-[52px] left-[7px] top-[70px] bg-white overflow-hidden rounded-tl-[10px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[10px] outline outline-1 outline-[#718EBF]">
        <div className="absolute w-[213px] left-[31px] top-[5px] flex justify-center items-center gap-[50px]">
          <img
            className="w-[58px] h-[41px]"
            src={`url`}
            alt="Avatar"
          />
          <div className="w-[106px] flex justify-center items-center gap-[10px]">
            <div className="text-center text-black/25 text-base font-normal leading-6">
              {datos.nombre} {datos.apellido}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

