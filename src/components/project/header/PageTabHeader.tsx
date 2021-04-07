import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { COLORS } from "../../../constants";

export interface IPanes {
  id: string;
  title: string;
  pathname: string;
}

interface IPageTabHeader extends WithTranslation, RouteComponentProps<any> {
  panes: IPanes[];
}
@observer
class PageTabHeader extends React.Component<IPageTabHeader> {
  public render() {
    const { panes, location } = this.props;
    const pathname = location.pathname;
    return (
      <div style={styles.divOverflowX}>
        <div style={styles.tap}>
          <div className="ui pointing secondary menu" style={styles.body}>
            {panes.map((menuItem: IPanes, index: number) => {
              return (
                <Link
                  id={menuItem.id}
                  key={index}
                  to={menuItem.pathname}
                  className={`${
                    pathname.includes(menuItem.pathname) ? "active" : ""
                    } item`}
                  style={
                    pathname.includes(menuItem.pathname)
                      ? styles.active
                      : styles.inactive
                  }
                >
                  {menuItem.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const styles: any = {
  divOverflowX: {
    overflowX: "auto",
    paddingLeft: 14,
    paddingRight: 14,
    background: "white"
  },
  tap: {
    borderBottom: "2px solid rgba(34,36,38,.15)"
  },
  body: {
    borderBottom: "none"
  },
  active: {
    borderColor: "#65A3D4",
    color: "#65A3D4"
  },
  inactive: {
    borderColor: undefined,
    color: COLORS.lightGrey
  }
};

export default withRouter(withTranslation()(PageTabHeader));
