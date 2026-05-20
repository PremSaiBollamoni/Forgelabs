import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function NavHeader({ links }) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-line bg-surface p-1"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {links.map((link) => (
        <Tab key={link.name} path={link.path} setPosition={setPosition}>
          {link.name}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({ children, setPosition, path }) => {
  const ref = useRef(null);
  const navigate = useNavigate();

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={() => navigate(path)}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-sm font-medium text-white mix-blend-difference md:px-5 md:py-2"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-[32px] rounded-full bg-primary md:h-[36px]"
    />
  );
};

export default NavHeader;
