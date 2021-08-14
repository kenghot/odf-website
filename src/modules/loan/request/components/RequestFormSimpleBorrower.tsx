import { inject, observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import { Loading } from "../../../../components/common/loading";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import IDCardReaderProfile from "../../../../components/idcard/IDCardReaderProfile";
import { IRequestItemModel } from "../RequestModel";
import { IAuthModel } from "../../../../modules/auth/AuthModel";
import { hasPermission } from "../../../../utils/render-by-permission";

interface IRequestFormSimpleBorrower extends WithTranslation {
  requestItem: IRequestItemModel;
  idCardBorrowerItems: IIDCardModel;
  requestType: string;
  documentDate: string;
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class RequestFormSimpleBorrower extends React.Component<
IRequestFormSimpleBorrower
> {
  public state = { showResult: false };
  public render() {
    const { requestItem, idCardBorrowerItems, t, documentDate, authStore } = this.props;
    //Beer12082021
    if (hasPermission("REQUEST.ONLINE.CREATE")) {
      this.props.requestItem!.borrower.setField({
        fieldname: "idCardNo",
        value: authStore!.userProfile.username ? authStore!.userProfile.username : ""
      });
      this.props.requestItem!.borrower.setField({
        fieldname: "title",
        value: authStore!.userProfile.title ? authStore!.userProfile.title : ""
      });
      this.props.requestItem!.borrower.setField({
        fieldname: "firstname",
        value: authStore!.userProfile.firstname ? authStore!.userProfile.firstname : ""
      });
      this.props.requestItem!.borrower.setField({
        fieldname: "lastname",
        value: authStore!.userProfile.lastname ? authStore!.userProfile.lastname : ""
      });
    }
    return (
      <React.Fragment>
        <Loading active={requestItem.borrower.loading} />
        {this.state.showResult ||
          requestItem.borrower.error.message ||
          requestItem.borrower.isVerify ? (
          this.renderResult()
        ) : (
          <Segment padded style={styles.segment}>
            {idCardBorrowerItems ? (
              <IDCardReaderProfile
                displayMode="simple"
                idCardReadingStore={idCardBorrowerItems}
                profile={requestItem.borrower}
                address={requestItem.borrower.idCardAddress}
                noSegment
                fieldname="borrow"
                calculateAgeDate={documentDate}
              />
            ) : null}
            <Button
              id="btn-submit-check-borrow"
              floated="right"
              color="blue"
              onClick={this.onVerify}
            >
              {t("module.loan.requestDetail.checkBasicQualifications")}
            </Button>
          </Segment>
        )}
      </React.Fragment>
    );
  }
  private renderResult() {
    const { requestItem, t } = this.props;
    return (
      <Segment placeholder>
        <Grid stackable>
          <Grid.Row verticalAlign="middle">
            <Grid.Column textAlign="center">
              <Header
                size="large"
                color={requestItem.borrower.isVerify ? "green" : "red"}
                style={
                  requestItem.borrower.isVerify
                    ? styles.isVerify
                    : styles.headerMarginBottom
                }
              >
                {requestItem.borrower.isVerify
                  ? t("module.loan.requestDetail.canFileLoan")
                  : t("module.loan.requestDetail.unableFileLoan")}
              </Header>
              {requestItem.borrower.error.message ? (
                <Header
                  size="small"
                  color={"red"}
                  style={styles.headerMarginTop}
                >
                  {requestItem.borrower.error.message}
                </Header>
              ) : null}

              <Button fluid color="blue" basic onClick={this.reCheck}>
                {t("module.loan.requestDetail.checkAgain")}
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
  private reCheck = async () => {
    const { requestItem } = this.props;
    try {
      await requestItem.borrower.error.resetAll();
      await requestItem.borrower.setField({
        fieldname: "isVerify",
        value: false
      });
      await this.setState({ showResult: false });
    } catch (e) {
      console.log(e);
    }
  };
  private onVerify = async () => {
    const { requestItem, requestType } = this.props;
    try {
      await requestItem.borrower.requestsVerifyBorrower(requestType);
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ showResult: true });
    }
  };
}
const styles: any = {
  segment: {
    paddingBottom: 50
  },
  headerMarginBottom: {
    marginBottom: 0
  },
  headerMarginTop: {
    marginTop: 0
  },
  isVerify: {
    marginBottom: 14
  }
};

export default withTranslation()(RequestFormSimpleBorrower);
