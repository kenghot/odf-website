import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  Form,
  Header,
  Icon,
  Menu,
  Modal,
  Tab
} from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { SubSectionContainer } from "../components/common";
import { IDCardModel } from "../components/idcard";
import { IIDCardModel } from "../components/idcard/IDCardModel";
import {
  RequesFormSimpleGuarantor,
  RequestFormSimpleBorrower
} from "../modules/loan/request/components";
import {
  IRequestItemModel,
  IRequestModel,
  RequestItemModel
} from "../modules/loan/request/RequestModel";

interface IM106RequestValidate extends WithTranslation, RouteComponentProps {
  trigger?: any;
  appStore?: IAppModel;
  requestCreate?: IRequestModel;
}

@inject("appStore", "requestCreate")
@observer
class M106RequestValidate extends React.Component<IM106RequestValidate> {
  public componentDidMount() {
    if (this.props.requestCreate!.requestItems.length === 0) {
      this.props.requestCreate!.setRequestItems();
    }
  }
  public state = { open: false, activeIndex: 0 };

  public handleTabChange = (e: any, data: any) =>
    this.setState({ activeIndex: data.activeIndex });

  public close = () => {
    this.setState({ open: false });
    // this.props.requestCreate!.resetAll();
  };
  public open = () => {
    this.setState({ open: true });
    if (this.props.requestCreate!.requestItems.length === 0) {
      this.props.requestCreate!.setRequestItems();
    }
  };
  public render() {
    const { t, trigger, appStore, requestCreate } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="fullscreen"
      // {...rest}
      >
        <Modal.Header>
          <Header textAlign="center" id="header-text-m106">
            {t("module.loan.requestDetail.checkPreliminaryInformation")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <Form>
            <Form.Select
              search
              fluid
              label={t("module.loan.agreementFormCreate.category")}
              placeholder={t(
                "module.loan.agreementFormCreate.pleaseSelectCategory"
              )}
              options={appStore!.enumItems("loanType")}
              onChange={(event, data) =>
                requestCreate!.setField({
                  fieldname: "requestType",
                  value: data.value
                })
              }
              value={requestCreate!.requestType}
            />
            {this.renderBody()}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            id="btn-submit-create-request-modal"
            disabled={!requestCreate!.check_list_verify}
            onClick={this.navigationToRequestCreatePage}
            style={styles.button}
          >
            {t("module.loan.requestDetail.createRequest")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  public renderBody() {
    const { requestCreate } = this.props;
    switch (requestCreate!.requestType) {
      case "G":
        return this.renderGroup(requestCreate!);
      default:
        return this.renderPerson(requestCreate!);
    }
  }
  private navigationToRequestCreatePage = async () => {
    const { history } = this.props;
    // this.setState({ open: false });
    this.close();
    history.push("/loan/request/create");
  };
  private renderGroup(request: IRequestModel) {
    const { t } = this.props;
    const { activeIndex } = this.state;
    const panes = request.requestItems.map(
      (item: IRequestItemModel, index: number) => ({
        menuItem: (
          <Menu.Item key={index}>
            {"# " + (index + 1).toString()}
            {index === 0 ? null : (
              <Icon
                name="x"
                link
                onClick={() =>
                  this.onRemoveBorrowerItem(
                    index,
                    item,
                    request.idCardBorrowerItems[index],
                    request.idCardGuarantorItems[index],
                    request.idCardSpouseItems[index]
                  )
                }
              />
            )}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane key={index}>
            <Form.Field
              key={index}
              label={t("module.loan.agreementDetail.informationBorrowers")}
              control={RequestFormSimpleBorrower}
              requestItem={item}
              idCardBorrowerItems={request.idCardBorrowerItems[index]}
              documentDate={request.documentDate}
            />
            <Form.Field
              label={t("module.loan.agreementFormCreate.vendorInformation")}
              width={16}
              control={RequesFormSimpleGuarantor}
              requestItem={item}
              idCardItem={request.idCardGuarantorItems[index]}
              documentDate={request.documentDate}
            />
          </Tab.Pane>
        )
      })
    );
    return (
      <SubSectionContainer
        title={t("module.loan.requestDetail.listBorrowers")}
        style={styles.container}
        stretch
        basic
        fluid
        linkLabel={t("module.loan.requestDetail.addListBorrowers")}
        iconName="plus circle"
        onClick={() =>
          request.addRequestItems(
            RequestItemModel.create({}),
            IDCardModel.create({}),
            IDCardModel.create({}),
            IDCardModel.create({})
          )
        }
      >
        <Tab
          activeIndex={activeIndex}
          onTabChange={this.handleTabChange}
          panes={panes}
          menu={{
            tabular: true,
            attached: true,
            fluid: true,
            widths: request.requestItems.length
          }}
        />
      </SubSectionContainer>
    );
  }
  private renderPerson(request: IRequestModel) {
    const { t } = this.props;
    return (
      <React.Fragment>
        {request.requestItems.map((item: IRequestItemModel, index: number) => {
          return (
            <React.Fragment key={index}>
              <Form.Field
                label={t("module.loan.agreementDetail.informationBorrowers")}
                control={RequestFormSimpleBorrower}
                requestItem={item}
                idCardBorrowerItems={request.idCardBorrowerItems[index]}
                documentDate={request.documentDate}
              />
              <Form.Field
                label={t("module.loan.agreementFormCreate.vendorInformation")}
                width={16}
                control={RequesFormSimpleGuarantor}
                requestItem={item}
                idCardItem={request.idCardGuarantorItems[index]}
                documentDate={request.documentDate}
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }

  private onRemoveBorrowerItem = async (
    index: number,
    requesItem: IRequestItemModel,
    idCardBorrowerItems: IIDCardModel,
    idCardGuarantorItems: IIDCardModel,
    idCardSpouseItems: IIDCardModel
  ) => {
    await requesItem.onRemove();
    await idCardBorrowerItems.onRemove();
    await idCardGuarantorItems.onRemove();
    await idCardSpouseItems.onRemove();
    await this.setState({ activeIndex: index - 1 });
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  }
};

export default withRouter(withTranslation()(M106RequestValidate));
