import React from "react";
import Button from "@mui/material/Button";

const Hero = () => {
  return (
    <>
      <div className="flex justify-center items-center w-full ">
        <div className="p-10 flex flex-col flex-wrap gap-5">
          <h1 className="text-5xl text-[#015ea3] font-bold">
            QR-Based Car Parking Management System
          </h1>
          <p className="text-3xl text-[#80c0e8]">
            Streamline parking operations with our smart, efficient solution for
            QR code-based access and payment.
          </p>
          <Button variant="contained" className="w-50 h-12">
            get started
          </Button>
        </div>
        <div className="">
          <img
            src="/src/assets/car.png"
            alt="car image"
            className="w-full  object-cover"
          />
        </div>
      </div>
    </>
  );
};
export default Hero;
