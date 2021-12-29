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
import { currency } from "../../../utils/format-helper";
import { IGuaranteeItemModel } from "../../loan/guarantee/GuaranteeModel";
import { IAccountReceivableModel } from "../AccountReceivableModel";
import {
  ShwoGdxDataModal,
} from "../../../modals";

interface IAccountReceivableGuarantorInfo extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
  editMode?: boolean;
  subDistrict: string;
  district: string;
  province: string;
  id: string;
}

@observer
class AccountReceivableGuarantorInfo extends React.Component<
IAccountReceivableGuarantorInfo
> {
  public guarantorAddress = LocationModel.create({});
  public _isMounted = false;

  public async componentDidMount() {
    const { accountReceivable, editMode } = this.props;
    this._isMounted = true;
    if (editMode && this._isMounted) {
      await this.guarantorAddress.loadSubdistrict(
        accountReceivable.guarantorContactAddress.subDistrict
      );
      await this.guarantorAddress.loadDistrict(
        accountReceivable.guarantorContactAddress.district
      );
      await this.guarantorAddress.loadProvince(
        accountReceivable.guarantorContactAddress.province
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
      await this.guarantorAddress.loadSubdistrict(
        accountReceivable.guarantorContactAddress.subDistrict
      );
      await this.guarantorAddress.loadDistrict(
        accountReceivable.guarantorContactAddress.district
      );
      await this.guarantorAddress.loadProvince(
        accountReceivable.guarantorContactAddress.province
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
          {accountReceivable.guarantee &&
            accountReceivable.guarantee.guaranteeItems.map(
              (item: IGuaranteeItemModel, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <Form.Group widths="equal">
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.name"
                        )}
                        value={item.guarantor.fullname || "-"}
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.iDCardNumber"
                        )}
                        value={item.guarantor.idCardformated || "-"}
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.dateOfBirth"
                        )}
                        value={date_display_CE_TO_BE(item.guarantor.birthDate)}
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.age"
                        )}
                        value={
                          t(
                            "module.accountReceivable.accountReceivableDetail.year",
                            { year: item.guarantor.age }
                          ) || "-"
                        }
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.occupation"
                        )}
                        value={`${item.guarantorOccupation.name} ${item.guarantorOccupation.description ? "-" : ""
                          } ${item.guarantorOccupation.description}`}
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.incomePerMonth"
                        )}
                        value={
                          t(
                            "module.accountReceivable.accountReceivableDetail.salaryBAHT",
                            { salary: currency(item.guarantorSalary) }
                          ) || "-"
                        }
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.workplace"
                        )}
                        value={item.guarantorCompanyName || "-"}
                      />
                      <FormDisplay
                        title={t(
                          "module.accountReceivable.accountReceivableDetail.position"
                        )}
                        value={item.guarantorPosition || "-"}
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
              value={accountReceivable.guarantorContactTelephone}
              onChange={(event: any, data: any) => {
                accountReceivable.setField({
                  fieldname: "guarantorContactTelephone",
                  value: data.value
                });
              }}
            />
          ) : (
            <FormDisplay
              title={t(
                "module.accountReceivable.accountReceivableDetail.telephoneNumber"
              )}
              value={accountReceivable.guarantorContactTelephone || "-"}
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
              addressStore={accountReceivable.guarantorContactAddress}
              locationStore={this.guarantorAddress}
            />
          ) : (
            <Form.Field
              label={t(
                "module.accountReceivable.accountReceivableDetail.addressContacted"
              )}
              width={16}
              control={AddressBody}
              addressStore={accountReceivable.guarantorContactAddress}
            />
          )}
          {editMode ? this.renderSaveButton() : null}
          {this.renderButtonGdxData()}

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
          onClick={accountReceivable.updateGuarantorContactAddress}
        >
          {t("module.accountReceivable.accountReceivableDetail.save")}
        </Button>
        <br />
        <br />
      </div>
    );
  }
  private renderButtonGdxData() {
    const { accountReceivable, t } = this.props;
    return (
      <div style={styles.marginTop}>
        <ShwoGdxDataModal
          accountReceivable={accountReceivable}
          trigger={
            <Button
              color="grey"
              floated="right"
              type="button"
              onClick={accountReceivable.getGdxGuarantors}
            >
              {t("module.accountReceivable.accountReceivableDetail.getGdxData")}

            </Button>
          }
        />
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

export default withTranslation()(AccountReceivableGuarantorInfo);
