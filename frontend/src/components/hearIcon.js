import React, { useEffect } from "react";
import lottie from "lottie-web";
import heartIcon from "../heartIcon.json";
const HeartIcon = () => {
  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: document.querySelector("#heart-icon"),
      animationData: heartIcon,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true,
    });
    return () => instance.destroy();
  });
  return (
    <>
      <div id="heart-icon" style={{ width: "60px", height: "60px" }} />
    </>
  );
};

export default HeartIcon;
