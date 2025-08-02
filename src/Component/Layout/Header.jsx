import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const Header = () => {
  return (
    <>
      <div className="bg-[#fafafa] w-full h-30 flex justify-between py-3 px-1">
        <div>
          <img
            src="/src/assets/logo.png"
            alt="logo-image"
            className="h-30 py-2 ml-8 bg-cover "
          />
        </div>
        <div className="">
          <ul className="flex  gap-5 m-8">
            <Stack direction="row" spacing={2}>
              <Button variant="text">My Booking</Button>
              <Button>Admin</Button>
              <Button variant="outlined">Sign Up</Button>
            </Stack>
          </ul>
        </div>
      </div>
    </>
  );
};
export default Header;
