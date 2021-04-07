import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import {
  AddressBody,
  AddressFormBody,
  LocationModel
} from "../../../components/address";
import { FormDisplay } from "../../../components/common";
import { date_display_CE_TO_BE } from "../../../utils";
import { IAgreementItemModel } from "../../loan/agreement/AgreementModel";
import { IAccountReceivableModel } from "../AccountReceivableModel";

interface IAccountReceivableBorrowerInfo extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
  editMode?: boolean;
  subDistrict: string;
  district: string;
  province: string;
  id: string;
}

@observer
class AccountReceivableBorrowerInfo extends React.Component<
  IAccountReceivableBorrowerInfo
> {
  public borrowerAddress = LocationModel.create({});
  public _isMounted = false;

  public async componentDidMount() {
    const { accountReceivable, editMode } = this.props;
    this._isMounted = true;
    if (editMode && this._isMounted) {
      await this.borrowerAddress.loadSubdistrict(
        accountReceivable.borrowerContactAddress.subDistrict
      );
      await this.borrowerAddress.loadDistrict(
        accountReceivable.borrowerContactAddress.district
      );
      await this.borrowerAddress.loadProvince(
        accountReceivable.borrowerContactAddress.province
      );
    }
  }

  public async componentDidUpdate(prevProps: any) {
    const { accountReceivable, editMode } = this.props;
    if (
      editMode &&
      (this.props.id !== prevProps.id ||
        this.props.subDistrict !== prevProps.subDistrict ||
        this.props.district !== prevProps.district ||
        this.props.province !== prevProps.province)
    ) {
      await this.borrowerAddress.loadSubdistrict(
        accountReceivable.borrowerContactAddress.subDistrict
      );
      await this.borrowerAddress.loadDistrict(
        accountReceivable.borrowerContactAddress.district
      );
      await this.borrowerAddress.loadProvince(
        accountReceivable.borrowerContactAddress.province
      );
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;
  }

  public render() {
    const { accountReceivable, editMode, t } = this.props;
    return (
      <Segment padded basic>
        <Form>
          {accountReceivable.agreement &&
            accountReceivable.agreement.agreementItems.map(
              (item: IAgreementItemModel, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <Form.Group widths="equal">
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.name"
                        )}
                        value={item.borrower.fullname || "-"}
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.iDCardNumber"
                        )}
                        value={item.borrower.idCardformated || "-"}
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.dateOfBirth"
                        )}
                        value={date_display_CE_TO_BE(item.borrower.birthDate)}
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.age"
                        )}
                        value={
                          t(
                            "module.accountReceivable.accountReceivableDetail.year",
                            { year: item.borrower.age }
                          ) || "-"
                        }
                      />
                    </Form.Group>
                  </React.Fragment>
                );
              }
            )}
          {editMode ? (
            <Form.Input
              label={t(
                "module.accountReceivable.accountReceivableDetail.telephoneNumber"
              )}
              placeholder={t(
                "module.accountReceivable.accountReceivableDetail.telephoneNumber"
              )}
              value={accountReceivable.borrowerContactTelephone}
              onChange={(event: any, data: any) => {
                accountReceivable.setField({
                  fieldname: "borrowerContactTelephone",
                  value: data.value
                });
              }}
            />
          ) : (
            <FormDisplay
              title={t(
                "module.accountReceivable.accountReceivableDetail.telephoneNumber"
              )}
              value={accountReceivable.borrowerContactTelephone || "-"}
            />
          )}
          {editMode ? (
            <Form.Field
              label={t(
                "module.accountReceivable.accountReceivableDetail.addressContacted"
              )}
              width={16}
              control={AddressFormBody}
              notDidMount={true}
              addressStore={accountReceivable.borrowerContactAddress}
              locationStore={this.borrowerAddress}
            />
          ) : (
            <Form.Field
              label={t(
                "module.accountReceivable.accountReceivableDetail.addressContacted"
              )}
              width={16}
              control={AddressBody}
              addressStore={accountReceivable.borrowerContactAddress}
            />
          )}
          {editMode ? this.renderSaveButton() : null}
        </Form>
      </Segment>
    );
  }
  private renderSaveButton() {
    const { accountReceivable, t } = this.props;
    return (
      <div style={styles.marginTop}>
        <Link
          to={`/account_receivable/view/${accountReceivable.id}/${accountReceivable.documentNumber}`}
        >
          <Button color="grey" floated="left" basic>
            {t(
              "module.accountReceivable.accountReceivableDetail.cancelEditing"
            )}
          </Button>
        </Link>

        <Button
          color="blue"
          floated="right"
          type="button"
          onClick={accountReceivable.updateBorrowerContactAddress}
        >
          {t("module.accountReceivable.accountReceivableDetail.save")}
        </Button>
        <br />
        <br />
      </div>
    );
  }
}

const styles: any = {
  marginTop: {
    marginTop: 35
  }
};

export default withTranslation()(AccountReceivableBorrowerInfo);
