import * as React from "react";
import { Label, LabelProps, SemanticSIZES } from "semantic-ui-react";
import { ColorProp } from "../../../constants/type";
import { getColor } from "../../../utils/get-color";
export interface IText extends LabelProps {
  size?: SemanticSIZES;
  shade?: ColorProp;
  underline?: boolean;
  children: any;
  style?: any;
  className?: any;
  id?: string;
}

class Text extends React.Component<IText> {
  public render() {
    const { size, underline, style, id, className, children, ...rest } = this.props;
    const textColor = this.textColor();
    const textSize: any = this.textSize();
    return (
      <Label
        {...rest}
        id={id}
        className={`label-text ${className}`}
        style={{
          color: textColor,
          textDecoration: underline ? "underline" : "none",
          ...styles.label,
          ...style
        }}
        size={textSize}
      >
        {children}
      </Label>
    );
  }

  private textColor = () => {
    const { shade } = this.props;

    return getColor(shade);
  };
  private textSize = () => {
    const { size } = this.props;
    return size || "large";
  };
}

const styles = {
  label: {
    // marginBottom: 6,
    // margin: 0,
    // padding: 0,
    // backgroundColor: "transparent",
  }
};

export default Text;
