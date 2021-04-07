import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import { Loading } from "../../../../components/common/loading";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import IDCardReaderProfile from "../../../../components/idcard/IDCardReaderProfile";
import { IRequestItemModel } from "../RequestModel";

interface IRequesFormSimpleGuarantor extends WithTranslation {
  requestItem: IRequestItemModel;
  idCardItem: IIDCardModel;
  requestType: string;
  documentDate: string;
}

@observer
class RequesFormSimpleGuarantor extends React.Component<
  IRequesFormSimpleGuarantor
> {
  public state = { showResult: false };
  public render() {
    const { requestItem, idCardItem, t, documentDate } = this.props;
    return (
      <React.Fragment>
        <Loading active={requestItem.guarantor.loading} />
        {this.state.showResult ||
        requestItem.guarantor.error.message ||
        requestItem.guarantor.isVerify ? (
          this.renderResult()
        ) : (
          <Segment padded style={styles.segment}>
            {idCardItem ? (
              <IDCardReaderProfile
                displayMode="simple"
                idCardReadingStore={idCardItem}
                profile={requestItem.guarantor}
                address={requestItem.guarantor.idCardAddress}
                noSegment
                fieldname="gurantor"
                calculateAgeDate={documentDate}
              />
            ) : null}
            <Button
              id="btn-submit-check-gurantor"
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
                color={requestItem.guarantor.isVerify ? "green" : "red"}
                style={
                  requestItem.guarantor.isVerify
                    ? styles.isVerify
                    : styles.headerMarginBottom
                }
              >
                {requestItem.guarantor.isVerify
                  ? t("module.loan.requestDetail.canGuaranteed")
                  : t("module.loan.requestDetail.cannotGuarantee")}
              </Header>
              {requestItem.guarantor.error.message ? (
                <Header
                  size="small"
                  color={"red"}
                  style={styles.headerMarginTop}
                >
                  {requestItem.guarantor.error.message}
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
      await requestItem.guarantor.error.resetAll();
      await requestItem.guarantor.setField({
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
      await requestItem.guarantor.requestsVerifyGuarantor(requestType);
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

export default withTranslation()(RequesFormSimpleGuarantor);
