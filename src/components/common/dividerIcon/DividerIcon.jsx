import "./DividerIcon.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export function DividerIcon(props) {
  const { titulo } = props;

  return (
    <div className="divider-icon">
      <h2 className="divider-icon_title">{titulo}</h2>
      <div className="divider-icon_left"></div>
      <FontAwesomeIcon className="divider-icon_icon" icon={faBars} />
      <div className="divider-icon_right"></div>
    </div>
  );
}