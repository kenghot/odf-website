import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Header, List, Message, Segment } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { IPosListModel } from "../modules/pos/PosListModel";
import { colorSetUser } from "../utils/get-color";

interface IPosLoginPage extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  posListStore?: IPosListModel;
}

@inject("appStore", "posListStore")
@observer
class PosLoginPage extends React.Component<IPosLoginPage> {
  public async componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "pos"
    });
    this.props.posListStore!.setField({
      fieldname: "filterActive",
      value: "true"
    });
    this.props.posListStore!.load_data();
  }
  public componentWillUnmount() {
    this.props.posListStore!.resetAll();
  }

  public render() {
    const { t, posListStore } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        {/* <Segment padded="very"> */}
        <Segment padded="very" style={styles.segment}>
          <Header
            size="medium"
            content={t("page.posListPage.headerContent")}
            subheader={t("page.posListPage.headerSubheader")}
            style={{ marginBottom: 42 }}
          />
          {/* </Segment>
        <Segment padded style={styles.segment}> */}
          <Loading active={posListStore!.loading} />
          <ErrorMessage errorobj={posListStore!.error} float timeout={5000} />
          {posListStore && posListStore.list.length > 0 ? (
            <React.Fragment>
              {posListStore.groupByOrgID.map((data: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <List horizontal verticalAlign="middle" style={styles.list}>
                      {data.map((item: any, itemIndex: number) => {
                        return (
                          <List.Item style={styles.listItem} key={itemIndex}>
                            <List.Header>
                              <Button
                                style={styles.button}
                                color={colorSetUser(index) as any}
                                onClick={() =>
                                  this.navigationToPosDetailPage(
                                    item.id,
                                    colorSetUser(index),
                                    item.posCode
                                  )
                                }
                              >
                                <Header as="h1" style={styles.labelButton}>
                                  {item.posCode}
                                  <Header.Subheader style={styles.numberOfLine}>
                                    {item.posName}
                                  </Header.Subheader>
                                </Header>
                              </Button>
                            </List.Header>
                            <List.Description style={styles.listDescription}>
                              {item.organization.orgName}
                            </List.Description>
                          </List.Item>
                        );
                      })}
                    </List>
                    {index !== +posListStore.groupByOrgID.length - 1 ? (
                      <React.Fragment>
                        <br />
                        <br />
                      </React.Fragment>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ) : (
            <Message
              icon="inbox"
              header={t("page.posListPage.messageListEmpty")}
            />
          )}
        </Segment>
      </React.Fragment>
    );
  }
  private navigationToPosDetailPage = async (
    id: string,
    color?: string,
    posCode?: string
  ) => {
    const { history } = this.props;
    history.push(`/pos/cashier/${id}`, { color, posCode });
  };
}
const styles: any = {
  list: {
    display: "flex",
    flexWrap: "wrap"
  },
  listItem: {
    marginLeft: 0,
    marginRight: 24
  },
  numberOfLine: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "99%",
    color: "white",
    fontWeight: "400",
    fontSize: "1rem",
    marginTop: "7px",
    height: "32px"
  },
  labelButton: {
    color: "white"
  },
  listDescription: {
    marginTop: 4,
    textAlign: "center",
    color: "rgba(0,0,0,.6)",
    fontWeight: "400",
    fontSize: "1rem",
    width: 140
  },
  button: {
    width: "140px",
    height: "120px",
    borderRadius: 10
  },
  segment: {
    paddingRight: "0px"
  }
};
export default withRouter(withTranslation()(PosLoginPage));
