import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, SemanticICONS } from "semantic-ui-react";
import SideMenu from "./SideMenu";

interface IGroupSideMenu extends RouteComponentProps<any>, React.Props<any> {
  groupName: string; // ไว้ Active SideMenu ตัวเองด้วย เมื่อ children ถูกเลือกอยู่ ดูได้ที่ checkActive
  iconName?: SemanticICONS;
  groupPathname?: string;
  title: string;
  hasPermission: boolean;
  expanded: boolean;
  id?: string;
}

class GroupSideMenu extends Component<IGroupSideMenu, any> {
  public state = { expandedGroup: false };
  public render() {
    const {
      title,
      iconName,
      hasPermission,
      expanded,
      groupPathname,
      id,
      children
    } = this.props;
    const childrenArray = React.Children.toArray(children);
    const allChildIsNull = childrenArray.every(
      (child: any) => child.props.hasPermission === false
    );
    return hasPermission && !allChildIsNull ? (
      <React.Fragment>
        <SideMenu
          id={id}
          title={title}
          iconName={iconName}
          hasPermission={true}
          expanded={expanded}
          active={this.checkActive()}
          onClickMenu={() => this.onSetState()}
          rightIcon={
            expanded ? (
              <Icon
                style={styles.chevronIconStyle}
                name={this.state.expandedGroup ? "chevron up" : "chevron down"}
                color="grey"
                inverted={this.state.expandedGroup}
              />
            ) : null
          }
        />
        {this.state.expandedGroup && expanded ? children : null}
      </React.Fragment>
    ) : null;
  }
  private checkActive = () => {
    const { groupName, location } = this.props;

    // เช็คว่า path slash แรก มีค่าตรงกับ groupName ไหม เช่น /admin/role_permission จะเช็ค admin กับ groupName
    if (
      location.pathname.split("/").length > 2 &&
      location.pathname.split("/")[1] === groupName
    ) {
      return true;
    } else {
      return false;
    }
  };
  private onSetState = async () => {
    const { expanded, history, groupPathname } = this.props;
    this.setState({ expandedGroup: !this.state.expandedGroup });
    if (groupPathname && !expanded) {
      history.push(groupPathname);
    }
  };
}
const styles: any = {
  chevronIconStyle: {
    //
  }
};
export default withRouter(GroupSideMenu);
