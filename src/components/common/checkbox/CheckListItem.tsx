import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Checkbox, List } from "semantic-ui-react";

interface ICheckListItem extends WithTranslation {
  onSelectCheckBox?: (value: any, checked: boolean) => void;
  checked?: boolean;
  value: any;
  title?: string;
  label?: string;
  disabled?: boolean;
}

class CheckListItem extends React.Component<ICheckListItem> {
  public render() {
    const { checked, title, label, disabled, value } = this.props;
    return (
      <List horizontal>
        <List.Item>
          <Checkbox
            disabled={disabled}
            checked={checked}
            onChange={(e: any, data: any) =>
              this.onSelectCheckBox(value, data.checked)
            }
            style={styles.checkbox}
          />
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>{title}</List.Header>
            <List.Description>{label}</List.Description>
          </List.Content>
        </List.Item>
      </List>
    );
  }
  private onSelectCheckBox = (value: any, checked: boolean) => {
    const { onSelectCheckBox } = this.props;
    if (typeof onSelectCheckBox !== "undefined") {
      onSelectCheckBox(value, checked);
    }
  };
}

const styles: any = {
  checkbox: {
    marginBottom: 7,
  },
};

export default withTranslation()(CheckListItem);
