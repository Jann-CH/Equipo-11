import React from 'react';

export default function Home() {
    return (
        <div className="relative w-[375px] h-[935px] bg-white overflow-hidden mx-auto shadow-2xl font-['Lato']">
            
            {/* Barra de Estado / Status Bar */}
            <div className="absolute w-[375px] h-[53px] left-0 top-[1px]">
                <div className="absolute w-[25px] h-[13px] left-[324.12px] top-[22px] opacity-35 rounded-[4.3px] border border-[#181818]"></div>
                <div className="absolute w-[1.33px] h-[4px] left-[350.02px] top-[26.67px] opacity-40 bg-[#181818]"></div>
                <div className="absolute w-[21px] h-[9px] left-[325.92px] top-[24px] bg-[#181818] rounded-[2.5px]"></div>
                <div className="absolute w-[58px] left-[6px] top-[18px] overflow-hidden flex flex-col justify-center items-center gap-[10px]">
                    <div className="self-stretch text-center text-[#181818] text-[17px] font-semibold leading-[22px]">9:41</div>
                </div>
                <div className="absolute w-[125px] h-[37px] left-[125px] top-[11px] bg-black rounded-[40px]"></div>
            </div>

            {/* Perfil / Usuario */}
            <div className="absolute w-[261px] h-[52px] left-[7px] top-[70px] bg-white overflow-hidden rounded-tl-[10px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[10px] outline outline-1 outline-[#718EBF]">
                <div className="absolute w-[213px] left-[31px] top-[5px] flex justify-center items-center gap-[50px]">
                    <img className="w-[58px] h-[41px]" src="https://placehold.co/58x41" alt="Avatar" />
                    <div className="w-[106px] flex justify-center items-center gap-[10px]">
                        <div className="text-center text-black/25 text-base font-normal leading-6">Agustín López</div>
                    </div>
                </div>
            </div>

            {/* Tarjeta Principal: Total Activo */}
            <div className="absolute w-[361px] h-[145px] left-[6px] top-[142px] bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[10px]">
                <div className="absolute w-[129px] h-[59px] left-[15px] top-[14px]">
                    <div className="absolute w-[129px] left-0 top-0 text-white/70 text-sm font-normal leading-[22px]">Total activo este mes</div>
                    <div className="absolute w-[129px] left-0 top-[28px] text-center text-white text-2xl font-bold leading-8">$1.093.807</div>
                </div>
                <div className="absolute w-[148px] left-[33px] top-[77px] text-white/70 text-sm font-normal leading-[22px]">12 % vs el mes anterior</div>
                <div className="absolute w-[14px] h-[14px] left-[15px] top-[81px]">
                    <div className="absolute w-[7.58px] h-[8.26px] left-[2.92px] top-[3.41px] bg-white/70"></div>
                </div>
                <div className="absolute w-[100px] h-[20px] left-[19px] top-[111px] bg-[#718EBF]/50 rounded-[6px]">
                    <div className="absolute left-[7px] top-0 text-[#E7EBF4]/80 text-[11px] font-normal leading-5">Presupuestos</div>
                    <div className="absolute left-[78px] top-0 text-white text-[13px] font-bold leading-5">42</div>
                </div>
                <div className="absolute w-[91px] h-[20px] left-[137px] top-[111px] bg-[#718EBF]/50 rounded-[6px]">
                    <div className="absolute left-[7px] top-0 text-[#E7EBF4]/80 text-[11px] font-normal leading-5">Aceptados</div>
                    <div className="absolute left-[68px] top-0 text-white text-[13px] font-bold leading-5">30</div>
                </div>
                <div className="absolute w-[95px] h-[20px] left-[246px] top-[111px] bg-[#718EBF]/50 rounded-[6px]">
                    <div className="absolute left-[7px] top-0 text-[#E7EBF4]/80 text-[11px] font-normal leading-5">Rechazados</div>
                    <div className="absolute left-[74px] top-0 text-white text-[13px] font-bold leading-5">06</div>
                </div>
            </div>

            {/* Actividad Semanal (Gráfico) */}
            <div className="absolute w-[364px] h-[214px] left-[6px] top-[299px] bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] overflow-hidden rounded-[10px]">
                <div className="absolute w-[154px] h-[31px] left-[12px] top-[10px]">
                    <div className="absolute left-0 top-0 text-black/20 text-lg font-semibold leading-[26px]">Actividad semanal</div>
                </div>
                <div className="absolute left-[305px] top-[16px] text-[#4D8F72] text-[13px] font-extrabold leading-5 cursor-pointer">Ver más</div>
                
                {/* Barras del gráfico */}
                <div className="absolute w-[31px] h-[38px] left-[25px] top-[98px]">
                    <div className="absolute w-[9px] h-[38px] left-0 top-0 bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[20px] left-[11px] top-[18px] bg-[#013364]/70 rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[6px] left-[22px] top-[32px] bg-[#013364]/30 rounded-t-[10px]"></div>
                </div>
                <div className="absolute w-[31px] h-[48px] left-[74px] top-[88px]">
                    <div className="absolute w-[9px] h-[48px] left-0 top-0 bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[25px] left-[11px] top-[23px] bg-[#013364]/70 rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[14px] left-[22px] top-[34px] bg-[#013364]/30 rounded-t-[10px]"></div>
                </div>
                <div className="absolute w-[31px] h-[38px] left-[123px] top-[99px]">
                    <div className="absolute w-[9px] h-[25px] left-0 top-[13px] bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[38px] left-[11px] top-0 bg-[#013364]/70 rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[10px] left-[22px] top-[28px] bg-[#013364]/30 rounded-t-[10px]"></div>
                </div>
                <div className="absolute w-[31px] h-[61px] left-[172px] top-[76px]">
                    <div className="absolute w-[9px] h-[61px] left-0 top-0 bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[15px] left-[11px] top-[46px] bg-[#013364]/70 rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[8px] left-[22px] top-[53px] bg-[#013364]/30 rounded-t-[10px]"></div>
                </div>
                <div className="absolute w-[31px] h-[38px] left-[221px] top-[98px]">
                    <div className="absolute w-[9px] h-[38px] left-0 top-0 bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[30px] left-[11px] top-[8px] bg-[#013364]/70 rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[19px] left-[22px] top-[19px] bg-[#013364]/30 rounded-t-[10px]"></div>
                </div>
                <div className="absolute w-[31px] h-[38px] left-[270px] top-[99px]">
                    <div className="absolute w-[9px] h-[25px] left-0 top-[13px] bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[14px] left-[11px] top-[24px] bg-[#013364]/70 rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[7px] left-[22px] top-[31px] bg-[#013364]/30 rounded-t-[10px]"></div>
                </div>
                <div className="absolute w-[31px] h-[38px] left-[319px] top-[99px]">
                    <div className="absolute w-[9px] h-[14px] left-0 top-[24px] bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[9px] left-[11px] top-[29px] bg-[#013364]/70 rounded-t-[10px]"></div>
                    <div className="absolute w-[9px] h-[5px] left-[22px] top-[33px] bg-[#013364]/30 rounded-t-[10px]"></div>
                </div>

                {/* Días de la semana labels */}
                <div className="absolute w-[322px] h-[20px] left-[30px] top-[142px] text-black/20 text-[13px]">
                    <span className="absolute left-0 top-0">Lun</span>
                    <span className="absolute left-[49px] top-0">Mar</span>
                    <span className="absolute left-[98px] top-0">Mie</span>
                    <span className="absolute left-[147px] top-0">Jue</span>
                    <span className="absolute left-[196px] top-0">Vie</span>
                    <span className="absolute left-[245px] top-0">Sab</span>
                    <span className="absolute left-[294px] top-0">Dom</span>
                </div>

                {/* Leyenda */}
                <div className="absolute w-[9px] h-[9px] left-[31px] top-[177px] bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-[2px]"></div>
                <div className="absolute w-[9px] h-[9px] left-[125px] top-[177px] bg-[#4D7093] rounded-[2px]"></div>
                <div className="absolute w-[9px] h-[9px] left-[219px] top-[177px] bg-[#B3C2D0] rounded-[2px]"></div>
                <div className="absolute left-[45px] top-[171px] text-black/20 text-[13px]">Aprobados</div>
                <div className="absolute left-[139px] top-[171px] text-black/20 text-[13px]">Pendientes</div>
                <div className="absolute left-[233px] top-[171px] text-black/20 text-[13px]">Rechazados</div>

                {/* Filtros superiores */}
                <div className="absolute w-[352px] h-[28px] left-[6px] top-[41px] bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] overflow-hidden rounded-[10px]">
                    <div className="absolute w-[92px] h-[22px] left-[118px] top-[3px] bg-gradient-to-t from-black/20 to-black/20 bg-[#013364] rounded-[10px]"></div>
                    <div className="absolute left-[33px] top-[4px] flex items-center gap-[72px]">
                        <span className="text-black text-[13px]">Diario</span>
                        <span className="text-white text-[13px]">Semanal</span>
                        <span className="text-black text-[13px]">Mensual</span>
                    </div>
                </div>
            </div>

            {/* Sección Recientes & Lista */}
            <div className="absolute w-[365px] h-[350px] left-[5px] top-[518px] overflow-hidden">
                <div className="absolute w-[359px] left-0 top-0 flex justify-between items-center">
                    <div className="w-[104px] h-[41px] relative">
                        <div className="absolute left-0 top-0 text-black/20 text-[18px] font-semibold leading-[26px]">Recientes</div>
                    </div>
                    <div className="text-[#4D8F72] text-[13px] font-extrabold leading-5 cursor-pointer">Ver más</div>
                </div>

                <div className="absolute w-[360px] left-[5px] top-[41px] flex flex-col gap-[9px]">
                    
                    {/* Item 1: Juan Pérez */}
                    <div className="w-full h-[72px] relative bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[10px]">
                        <div className="absolute w-[32px] px-[8px] py-[5px] left-[20px] top-[20px] bg-[#013364] overflow-hidden rounded-[16px] flex flex-col justify-center items-center">
                            <span className="text-white text-[14px]">JP</span>
                        </div>
                        <div className="absolute left-[75px] top-[15px] text-black/20 text-[16px] font-bold font-['Inter'] leading-7">Juan Pérez</div>
                        <div className="absolute left-[75px] top-[35px] text-black/20 text-[12px] leading-[22px]">#P-0040</div>
                        <div className="absolute left-[130px] top-[36px] text-[#4D8F72] text-[12px] font-bold leading-5">Vence en 28 días</div>
                        <div className="absolute left-[261px] top-[44px] text-black/20 text-[14px] font-semibold leading-[22px]">$300.000,00</div>
                        <div className="absolute w-[81px] h-[25px] left-[261px] top-[11px]">
                            <div className="absolute w-full h-full bg-[#FFC107]/10 rounded-[7px]"></div>
                            <div className="absolute left-[14.23px] top-[2px] text-[#FFC107] text-[13px] font-bold leading-5">Pendiente</div>
                            <div className="absolute w-[6.28px] h-[6.28px] left-[4.29px] top-[8.92px] bg-[#FFC107] rounded-full"></div>
                        </div>
                    </div>

                    {/* Item 2: Arquitectos Zazz */}
                    <div className="w-full h-[72px] relative bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[10px]">
                        <div className="absolute w-[32px] px-[8px] py-[5px] left-[20px] top-[20px] bg-[#013364] overflow-hidden rounded-[16px] flex flex-col justify-center items-center">
                            <span className="text-white text-[14px]">AZ</span>
                        </div>
                        <div className="absolute left-[75px] top-[13px] text-black/20 text-[16px] font-bold font-['Inter'] leading-7">Arquitectos Zazz</div>
                        <div className="absolute left-[75px] top-[35px] text-black/20 text-[12px] leading-[22px]">#P-0029</div>
                        <div className="absolute left-[130px] top-[36px] text-[#4D8F72] text-[12px] font-bold leading-5">Vence en 28 días</div>
                        <div className="absolute left-[261px] top-[44px] text-black/20 text-[14px] font-semibold leading-[22px]">$100.000,00</div>
                        <div className="absolute w-[81px] h-[25px] left-[261px] top-[11px]">
                            <div className="absolute w-full h-full bg-[#4CAF50]/10 rounded-[7px]"></div>
                            <div className="absolute left-[14.23px] top-[2px] text-[#4CAF50] text-[13px] font-bold leading-5">Aprobado</div>
                            <div className="absolute w-[6.28px] h-[6.28px] left-[4.29px] top-[8.92px] bg-[#4CAF50] rounded-full"></div>
                        </div>
                    </div>

                    {/* Item 3: Construcciones SRL */}
                    <div className="w-full h-[72px] relative bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[10px]">
                        <div className="absolute w-[32px] px-[8px] py-[5px] left-[20px] top-[20px] bg-[#013364] overflow-hidden rounded-[16px] flex flex-col justify-center items-center">
                            <span className="text-white text-[14px]">CS</span>
                        </div>
                        <div className="absolute left-[75px] top-[15px] text-black/20 text-[16px] font-bold font-['Inter'] leading-7">Construcciones SRL</div>
                        <div className="absolute left-[75px] top-[35px] text-black/20 text-[12px] leading-[22px]">#P-0041</div>
                        <div className="absolute left-[130px] top-[36px] text-[#4D8F72] text-[12px] font-bold leading-5">Vence en 30 días</div>
                        <div className="absolute left-[261px] top-[44px] text-black/20 text-[14px] font-semibold leading-[22px]">$450.000,00</div>
                        <div className="absolute w-[81px] h-[25px] left-[261px] top-[11px]">
                            <div className="absolute w-full h-full bg-[#A3ADA7]/10 rounded-[7px]"></div>
                            <div className="absolute left-[14.95px] top-[2px] text-[#A3ADA7] text-[13px] font-bold leading-5">Borrador</div>
                            <div className="absolute w-[6.26px] h-[6.26px] left-[4.27px] top-[8.92px] bg-[#A3ADA7] rounded-full"></div>
                        </div>
                    </div>

                    {/* Item 4: Construcciones Norte */}
                    <div className="w-full h-[72px] relative bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[10px]">
                        <div className="absolute w-[32px] px-[8px] py-[5px] left-[20px] top-[20px] bg-[#013364] overflow-hidden rounded-[16px] flex flex-col justify-center items-center">
                            <span className="text-white text-[14px]">CN</span>
                        </div>
                        <div className="absolute left-[75px] top-[15px] text-black/20 text-[16px] font-bold font-['Inter'] leading-7">Construcciones Norte</div>
                        <div className="absolute left-[75px] top-[35px] text-black/20 text-[12px] leading-[22px]">#P-0039</div>
                        <div className="absolute left-[130px] top-[36px] text-[#4D8F72] text-[12px] font-bold leading-5">Vence en 15 días</div>
                        <div className="absolute left-[261px] top-[44px] text-black/20 text-[14px] font-semibold leading-[22px]">$800.000,00</div>
                        <div className="absolute w-[81px] h-[25px] left-[261px] top-[11px]">
                            <div className="absolute w-full h-full bg-[#FF3131]/10 rounded-[7px]"></div>
                            <div className="absolute left-[14.73px] top-[2px] text-[#FF3131] text-[13px] font-bold leading-5">Rechazado</div>
                            <div className="absolute w-[6.28px] h-[6.28px] left-[4.29px] top-[8.92px] bg-[#FF3131] rounded-full"></div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Barra de Navegación Inferior */}
            <div className="absolute w-[375px] h-[63px] px-[8px] left-[1px] top-[872px] bg-white rounded-t-[10px] flex justify-center items-center">
                <div className="w-[112px] self-stretch flex flex-col justify-center items-center">
                    <div className="w-[64px] h-[32px] relative rounded-full">
                        <div className="absolute w-[64px] h-[32px] overflow-hidden rounded-full backdrop-blur-[50px]">
                            <div className="absolute w-[24px] h-[24px] left-[20px] top-[4px] bg-[#013364] rounded-[4px]">
                                <div className="absolute w-[18.4px] h-[16.66px] left-[2.80px] top-[3.34px] bg-white"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[112px] h-[65px] pt-[12px] pb-[16px] flex flex-col justify-end items-center gap-[4px]">
                    <div className="w-[64px] h-[32px] relative overflow-hidden rounded-full">
                        <div className="absolute w-[64px] h-[32px]">
                            <div className="absolute w-[24px] h-[24px] left-[20px] top-[3.5px] bg-white rounded-[16px] outline outline-1 outline-[#013364]">
                                <div className="absolute w-[14px] h-[14px] left-[5px] top-[5px] bg-[#013364]"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[65px] pt-[12px] pb-[16px] flex flex-col justify-end items-center gap-[4px]">
                    <div className="w-[64px] h-[32px] relative rounded-full">
                        <div className="absolute w-[64px] h-[32px] overflow-hidden">
                            <div className="absolute w-[24px] h-[24px] left-[20px] top-[4.5px] rounded-[4px]">
                                <div className="absolute w-[18px] h-[10px] left-[3px] top-[7px] bg-[#013364]"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[112px] h-[65px] pt-[12px] pb-[16px] flex flex-col justify-end items-center gap-[4px]">
                    <div className="w-[64px] h-[32px] relative overflow-hidden rounded-full">
                        <div className="absolute w-[64px] h-[32px]">
                            <div className="absolute w-[24px] h-[24px] left-[22.50px] top-[3px] rounded-[4px] outline outline-[1.50px] outline-[#013364]"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}