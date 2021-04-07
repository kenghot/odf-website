import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Label, SemanticSIZES } from "semantic-ui-react";
export interface IARStatusIcon extends WithTranslation {
  value: string;
  label?: string;
  size?: SemanticSIZES;
}

class ARStatusIcon extends React.Component<IARStatusIcon> {
  public render() {
    const { label } = this.props;
    return (
      <React.Fragment>
        {this.renderStatus()}
        {label ? ` ${label}` : null}
      </React.Fragment>
    );
  }

  private renderStatus = () => {
    const { value, size, t } = this.props;
    switch (value) {
      case "0":
        return (
          <Label size={size} color={"green"}>
            0
          </Label>
        );
      case "1":
        return (
          <Label size={size} color={"yellow"}>
            1
          </Label>
        );
      case "2":
        return (
          <Label size={size} color={"orange"}>
            2
          </Label>
        );
      case "3":
        return (
          <Label size={size} color={"orange"}>
            3
          </Label>
        );
      case "4":
        return (
          <Label size={size} color={"orange"}>
            4
          </Label>
        );
      case "5":
        return (
          <Label size={size} color={"red"}>
            5
          </Label>
        );
      case "6":
        return (
          <Label size={size} color={"red"}>
            6
          </Label>
        );
      case "7":
        return (
          <Label size={size} color={"red"}>
            7
          </Label>
        );
      case "8":
        return (
          <Label size={size} color={"brown"}>
            8
          </Label>
        );
      case "9":
        return (
          <Label size={size} color={"brown"}>
            9
          </Label>
        );
      case "F":
        return (
          <Label size={size} color={"black"}>
            F
          </Label>
        );
      default:
        return t("module.accountReceivable.arStatusIcon.waitingProcess");
    }
  };
}
export default withTranslation()(ARStatusIcon);
