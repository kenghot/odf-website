import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAppModel } from "../../AppModel";
import { COLORS } from "../../constants";

interface IFullScreenPageLayout
  extends WithTranslation,
    RouteComponentProps<any> {
  children: any;
  childrenPageHeader?: any;
  appStore?: IAppModel;
}

@inject("appStore", "authStore")
@observer
class FullScreenPageLayout extends React.Component<IFullScreenPageLayout> {
  public render() {
    const { children, childrenPageHeader, appStore } = this.props;
    return (
      <div
        className="ui page modals dimmer transition visible active"
        style={styles.page}
      >
        <div className="ui modal transition visible active" style={styles.body}>
          {childrenPageHeader ? (
            <div className="header" style={styles.header}>
              {childrenPageHeader}
            </div>
          ) : null}
          <div
            className={"content"}
            style={{
              ...styles.content,
              overflowY: !appStore!.tabletMode ? "initial" : "auto"
            }}
          >
            <div className="description">{children}</div>
          </div>
        </div>
      </div>
    );
  }
}
const styles: any = {
  page: {
    padding: 0
  },
  body: {
    overflow: "hidden",
    height: "100%",
    margin: 0,
    width: "100%",
    borderRadius: 0
  },
  header: {
    borderBottomWidth: 0,
    paddingLeft: 0,
    paddingBottom: 0,
    paddingRight: 0,
    paddingTop: 0
  },
  content: {
    backgroundColor: COLORS.contentGrey,
    maxHeight: "initial",
    height: "100%",
    paddingTop: 13,
    paddingRight: 15,
    paddingLeft: 14
  }
};
export default withRouter(withTranslation()(FullScreenPageLayout));
