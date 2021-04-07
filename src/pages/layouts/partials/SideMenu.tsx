import React, { Component } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Grid, Header, Icon, Menu, SemanticICONS } from "semantic-ui-react";
import { Text } from "../../../components/common";
import { COLORS } from "../../../constants";

interface ISideMenu extends RouteComponentProps<any>, React.Props<any> {
  name?: string;
  pathname?: string;
  iconName?: SemanticICONS;
  title: string;
  hasPermission: boolean;
  expanded: boolean;
  rightIcon?: any;
  active?: boolean;
  onClickMenu?: () => void;
  id?: string;
}

class SideMenu extends Component<ISideMenu, any> {
  public render() {
    const {
      name,
      pathname,
      title,
      iconName,
      hasPermission,
      expanded,
      location,
      rightIcon,
      active,
      onClickMenu,
      id
    } = this.props;
    const isActive =
      active !== undefined
        ? active
        : location.pathname.includes(pathname || "#");
    return hasPermission ? (
      <Menu.Item
        id={id}
        active={isActive}
        name={name}
        link
        as="div"
        style={styles.menuItem}
        onClick={onClickMenu}
      >
        <Grid columns={"equal"}>
          <Grid.Column
            verticalAlign={"middle"}
            textAlign={expanded ? "left" : "center"}
          >
            <Link to={pathname || "#"}>
              <Header
                size="tiny"
                className={isActive ? "primary" : "lightgrey"}
                style={styles.headerStyle}
                inverted
              >
                {iconName ? (
                  <Icon
                    name={iconName}
                    size="mini"
                    inverted={isActive}
                    style={isActive ? styles.textColorActive : styles.textColor}
                  />
                ) : (
                  <Icon
                    name={undefined}
                    color="grey"
                    size="mini"
                    inverted={isActive}
                  />
                )}
                {expanded ? (
                  <Header.Content>
                    <Text
                      style={
                        isActive ? styles.textColorActive : styles.textColor
                      }
                    >
                      {title}
                    </Text>
                  </Header.Content>
                ) : null}
              </Header>
            </Link>
          </Grid.Column>
          {rightIcon ? (
            <Grid.Column verticalAlign={"middle"} width={"3"}>
              {rightIcon}
            </Grid.Column>
          ) : null}
        </Grid>
      </Menu.Item>
    ) : null;
  }
}
const styles: any = {
  menuItem: {
    paddingTop: "9px",
    paddingBottom: "9px",
  },
  headerStyle: {
    margin: 0,
  },
  textColorActive: {
    color: "white",
  },
  textColor: {
    color: COLORS.greyOnBlack,
  },
};
export default withRouter(SideMenu);
