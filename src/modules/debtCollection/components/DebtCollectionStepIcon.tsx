import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Label, Button, List } from "semantic-ui-react";

interface IDebtCollectionStepIcon extends WithTranslation {
  step: number;
  border?: boolean;
  title?: string;
}

@observer
class DebtCollectionStepIcon extends React.Component<IDebtCollectionStepIcon> {
  public render() {
    const { step, border, title } = this.props;
    let color: any;
    let stepText = "";
    switch (step) {
      case 0:
        color = "teal";
        break;
      case 1:
        color = "yellow";
        break;
      case 2:
        color = "orange";
        break;
      case 3:
        color = "red";
        break;
      default:
        color = "grey";
        stepText = "-";
        break;
    }
    return border ? (
      <Button as="div" size="small" basic color={color}>
        <List horizontal size="small">
          <List.Item>{title ? `${title} :` : ""}</List.Item>
          <List.Item>
            <Label size="small" circular color={color}>
              {stepText || step}
            </Label>
          </List.Item>
        </List>
      </Button>
    ) : (
      <Label size="small" circular color={color}>
        {stepText || step}
      </Label>
    );
  }
}
export default withTranslation()(DebtCollectionStepIcon);
