import { observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Menu } from "semantic-ui-react";

export interface IMenuButton extends WithTranslation {
  children: any;
}
@observer
class MenuButton extends React.Component<IMenuButton> {
  public render() {
    const { t, children } = this.props;
    return (
      <Menu secondary stackable className="menu-table-responsive">
        <Menu.Item>{t("component.menuButton.chooseMultipleItems")}</Menu.Item>
        {React.Children.map(children, function(child) {
          return <Menu.Item>{child}</Menu.Item>;
        })}
      </Menu>
    );
  }
}

export default withTranslation()(MenuButton);
