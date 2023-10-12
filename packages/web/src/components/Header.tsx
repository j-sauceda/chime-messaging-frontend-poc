// Third-party libraries
import { FC } from "react";

// Custom types & interfaces
interface HeaderProps {
  text: string;
  onClickButton: () => void;
}

const Header: FC<HeaderProps> = ({ text, onClickButton }) => {
  return (
    <div 
      className="card" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        marginBottom: "1rem", 
        marginTop: "3rem" 
      }}
    >
      <h5 style={{ color: "#5ba9e4" }}>Chime Messaging POC</h5>
      <span
        className="secondary"
        onClick={onClickButton}
        role="button"
      >{text}</span>
    </div>
  );
}

export default Header;
