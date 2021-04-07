import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Segment, Tab } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { OcupationTable } from "../modules/admin/occupation/components";
import { OcupationListModel } from "../modules/admin/occupation/OcupationListModel";
import { IUserListModel } from "../modules/admin/user/UserListModel";

interface IOcupationListPage extends WithTranslation {
  appStore?: IAppModel;
  searchUserListStore?: IUserListModel;
}

@inject("appStore")
@observer
class OcupationListPage extends React.Component<IOcupationListPage> {
  public ocupationList = OcupationListModel.create({});
  public async componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "admin" });
    await this.ocupationList.load_data();
  }
  public render() {
    const { t } = this.props;
    this.props.appStore!.setHeaderHeight();
    const panes = [
      {
        menuItem: t("page.ocupationListPage.careerBorrowers"),
        render: () => (
          <Tab.Pane>
            {
              <OcupationTable
                header={t("page.ocupationListPage.careerBorrowers")}
                subheader={t("page.ocupationListPage.careerListBorrowers")}
                ocupationListStore={this.ocupationList}
                ocupationType={0}
              />
            }
          </Tab.Pane>
        )
      },
      {
        menuItem: t("page.ocupationListPage.occupationSponsors"),
        render: () => (
          <Tab.Pane>
            {
              <OcupationTable
                header={t("page.ocupationListPage.occupationSponsors")}
                subheader={t("page.ocupationListPage.careerListSponsors")}
                ocupationListStore={this.ocupationList}
                ocupationType={1}
              />
            }
          </Tab.Pane>
        )
      },
      {
        menuItem: t("page.ocupationListPage.careerLoan"),
        render: () => (
          <Tab.Pane>
            {
              <OcupationTable
                header={t("page.ocupationListPage.careerLoan")}
                subheader={t("page.ocupationListPage.listCareerRequests")}
                ocupationListStore={this.ocupationList}
                ocupationType={2}
              />
            }
          </Tab.Pane>
        )
      }
    ];

    return (
      <Segment style={styles.container}>
        <ErrorMessage errorobj={this.ocupationList.error} />
        <Loading active={this.ocupationList.loading} />
        <Tab
          panes={panes}
          menu={{
            tabular: true,
            attached: true,
            fluid: true,
            widths: 3
          }}
        />
      </Segment>
    );
  }
}
const styles: any = {
  container: {
    padding: 0,
    boxShadow: "none",
    borderWidth: 0
  }
};

export default withTranslation()(OcupationListPage);
