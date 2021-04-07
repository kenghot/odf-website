import * as React from "react";
import { Button, Icon, Label, SemanticCOLORS } from "semantic-ui-react";

interface IStatusBlock {
  label: string;
  color?: SemanticCOLORS;
}
class StatusBlock extends React.Component<IStatusBlock> {
  public render() {
    const { label, color } = this.props;
    return (
      <Button as="div" labelPosition="right" style={styles.icon}>
        <Button icon color={color || "blue"} style={styles.icon}>
          <Icon name="circle" />
        </Button>
        <Label basic color={color || "blue"}>
          {label}
        </Label>
      </Button>
    );
  }
}
const styles: any = {
  icon: {
    cursor: "default",
  },
};
export default StatusBlock;
