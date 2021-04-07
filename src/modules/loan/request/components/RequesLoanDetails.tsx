import { observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown, Form, Menu } from "semantic-ui-react";
import { BudgetAllocationItem, RequesObjective } from ".";
import {
  AddressBody,
  AddressFormBody,
  LocationModel
} from "../../../../components/address";
import { MapMarker } from "../../../../components/common";
import { IRequestModel } from "../RequestModel";

interface IRequesLoanDetails extends WithTranslation {
  request: IRequestModel;
  readOnly?: boolean;
  mode?: "editMode" | "createMode";
}
@observer
class RequesLoanDetails extends React.Component<IRequesLoanDetails> {
  public state = {
    subDistrict: "",
    district: "",
    province: ""
  };
  public locationStore = LocationModel.create({});
  public _isMounted = false;
  public componentDidMount() {
    // const { request } = this.props;
    this._isMounted = true;
    if (!this.props.readOnly) {
      setTimeout(() => {
        this.locationStore.loadSubdistrict(
          this.props.request.requestOccupationAddress.subDistrict
        );
        this.locationStore.loadDistrict(
          this.props.request.requestOccupationAddress.district
        );
        this.locationStore.loadProvince(
          this.props.request.requestOccupationAddress.province
        );
      }, 2000);
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;
  }

  public render() {
    const { request, readOnly, mode, t } = this.props;
    return (
      <React.Fragment>
        <Form.Field
          required
          label={t("module.loan.requestDetail.wishBorrowMoney")}
          control={RequesObjective}
          request={request}
          readOnly={readOnly}
        />
        <BudgetAllocationItem request={request} readOnly={readOnly} />
        {readOnly ? (
          <Form.Field
            label={t("module.loan.requestDetail.inOccupation")}
            width={16}
            control={AddressBody}
            addressStore={request.requestOccupationAddress}
          />
        ) : (
          this.renderAddress()
        )}
        <Form.Field
          label={t("module.loan.requestDetail.workplaceLocationMap")}
          width={16}
          control={MapMarker}
          addressStore={request.requestOccupationAddress}
          mode={mode}
        />
      </React.Fragment>
    );
  }

  private renderAddress() {
    const { t, request } = this.props;
    return (
      <Form.Field>
        <div style={styles.padding}>
          <label>{t("module.loan.requestDetail.inOccupation")}</label>
          <Menu compact floated="right">
            <Dropdown
              item
              text={t("module.loan.requestDetail.retrieveAddress")}
            >
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.onChangeSelectAddress(1)}>
                  {t("component.idCardReader.addressPerIDCard")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.onChangeSelectAddress(2)}>
                  {t("module.loan.agreementFormCreate.houseAddress")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.onChangeSelectAddress(3)}>
                  {t("module.loan.requestDetail.currentAddress")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.onChangeSelectAddress(4)}>
                  {t("module.loan.requestDetail.clearData")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu>
        </div>
        <AddressFormBody
          addressStore={request.requestOccupationAddress}
          locationStore={this.locationStore}
        />
      </Form.Field>
    );
  }

  private onChangeSelectAddress = (typeSelectAddress: number) => {
    const { request } = this.props;
    switch (typeSelectAddress) {
      case 1:
        request.setField({
          fieldname: "requestOccupationAddress",
          value: clone(request.requestItems[0].borrower.idCardAddress)
        });
        break;
      case 2:
        if (request.requestItems[0].borrower.registeredAddressType === 0) {
          request.setField({
            fieldname: "requestOccupationAddress",
            value: clone(request.requestItems[0].borrower.idCardAddress)
          });
        } else {
          request.setField({
            fieldname: "requestOccupationAddress",
            value: clone(request.requestItems[0].borrower.registeredAddress)
          });
        }
        break;
      case 3:
        if (request.requestItems[0].borrower.currentAddressType === 0) {
          request.setField({
            fieldname: "requestOccupationAddress",
            value: clone(request.requestItems[0].borrower.idCardAddress)
          });
        } else if (request.requestItems[0].borrower.currentAddressType === 1) {
          request.setField({
            fieldname: "requestOccupationAddress",
            value: clone(request.requestItems[0].borrower.registeredAddress)
          });
        } else {
          request.setField({
            fieldname: "requestOccupationAddress",
            value: clone(request.requestItems[0].borrower.currentAddress)
          });
        }
        break;
      case 4:
        request.requestOccupationAddress.resetAll();
        break;
      default:
        break;
    }
    this.locationStore.loadSubdistrict(
      this.props.request.requestOccupationAddress.subDistrict
    );
    this.locationStore.loadDistrict(
      this.props.request.requestOccupationAddress.district
    );
    this.locationStore.loadProvince(
      this.props.request.requestOccupationAddress.province
    );
  };
}
const styles: any = {
  padding: {
    paddingBottom: 21
  }
};

export default withTranslation()(RequesLoanDetails);
