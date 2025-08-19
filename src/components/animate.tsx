import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function Animate() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 500,
      easing: "ease-out-cubic",
    });
  });
  return null;
}
