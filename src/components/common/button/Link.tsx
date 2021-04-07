import * as React from "react";
import {
  Icon,
  SemanticFLOATS,
  SemanticICONS,
  SemanticSIZES,
  StrictLabelProps
} from "semantic-ui-react";
import { ColorProp } from "../../../constants/type";
import { getColor } from "../../../utils/get-color";
import { Text } from "../text";
export interface ILink extends StrictLabelProps {
  icon?: SemanticICONS;
  iconPosition?: SemanticFLOATS;
  size?: SemanticSIZES;
  hideUnderline?: boolean;
  children: any;
  shade?: ColorProp;
  onClick?: () => void;
  style?: any;
  id?: string;
}

class Link extends React.Component<ILink> {
  public render() {
    const {
      children,
      icon,
      size,
      iconPosition,
      hideUnderline,
      style,
      id,
      ...rest
    } = this.props;
    const textColor = this.textColor();
    return (
      <Text
        id={id}
        as="a"
        onClick={this.onClick}
        style={{
          color: textColor,
          textDecoration: hideUnderline ? "none" : "underline",
          ...style
        }}
        size={size}
        {...rest}
      >
        {icon && iconPosition === "left" ? (
          <Icon name={icon || "question"} />
        ) : null}
        {children}
        {icon && iconPosition === "right" ? (
          <Icon name={icon || "question"} />
        ) : null}
      </Text>
    );
  }

  private onClick = () => {
    const { onClick } = this.props;
    if (typeof onClick !== "undefined") {
      onClick();
    }
  };
  private textColor = () => {
    const { shade } = this.props;
    return getColor(shade);
  };
}
export default Link;
