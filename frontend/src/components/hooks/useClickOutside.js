import { useEffect } from "react";

export function useClickOutSide(ref, callback) {
  const handleClick = (evt) => {
    if (ref.current && !ref.current.contains(evt.target)) callback();
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
}

export function useClickOutSideContextMenu(ref, callback, refButton) {
  const HandleClick = (evt) => {
    if (
      ref.current &&
      !ref.current.contains(evt.target) &&
      evt.target !== refButton.current
    ) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", HandleClick);
    return () => {
      document.removeEventListener("mousedown", HandleClick);
    };
  }, []);
}
