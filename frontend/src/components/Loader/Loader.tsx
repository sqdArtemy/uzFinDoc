import React, { createContext, useContext, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const LoaderContext = createContext({
  isOpen: false,
  showLoader: () => {},
  hideLoader: () => {},
});
export const useLoader = () => useContext(LoaderContext);

export function LoaderProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const showLoader = () => setIsOpen(true);
  const hideLoader = () => setIsOpen(false);

  return (
    <LoaderContext.Provider value={{ isOpen, showLoader, hideLoader }}>
      <Loader />
      {children}
    </LoaderContext.Provider>
  );
}

function Loader() {
  const { isOpen, hideLoader } = useLoader(); // Use the context

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: 9999 }}
      open={isOpen}
      onClick={hideLoader} // Use hideLoader from context
    >
      <CircularProgress
        color="inherit"
        style={{
          width: "100px",
          height: "100px",
        }}
      />
    </Backdrop>
  );
}
