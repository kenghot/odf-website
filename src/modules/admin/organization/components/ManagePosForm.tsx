import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Header, Segment } from "semantic-ui-react";
import { LocationModel } from "../../../../components/address";
import { IDCardModel } from "../../../../components/idcard";
import { PosListModel } from "../../../pos/PosListModel";
import { SpecialPosModel } from "../../../pos/SpecialPosModel";
import { IOrgModel } from "../OrgModel";
import PosDDL from "./PosDDL";

interface IManagePosForm extends WithTranslation {
  org: IOrgModel;
}
@observer
class ManagePosForm extends React.Component<IManagePosForm> {
  public locationStore = LocationModel.create({});
  public idCard = IDCardModel.create({});
  private posList = PosListModel.create({});

  public render() {
    const { t, org } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.ManagePosForm.header")}
          subheader={t("module.admin.ManagePosForm.subheader")}
          style={styles.header}
        />
        <Form>
          <Form.Field
            id="org-pos-ddl"
            label={t("module.admin.ManagePosForm.posDonateAllowace")}
            control={PosDDL}
            org={org}
            posList={this.posList}
            value={org.posDonateAllowaceId}
            onChange={this.onChangePosDonateAllowaceDDL}
          />
          <Form.Field
            id="org-pos-ddl"
            label={t("module.admin.ManagePosForm.posDonateDirect")}
            control={PosDDL}
            org={org}
            posList={this.posList}
            value={org.posDonateDirectId}
            onChange={this.onChangePosDonateDirectDDL}
          />
          <Form.Group widths="equal">
            <Form.Field />
            <Form.Button
              id="form-button-submit-manage-document-form"
              width={5}
              fluid
              floated="right"
              color="blue"
              onClick={this.updateForm}
            >
              {t("module.admin.manageDocumentForm.save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }

  private updateForm = async () => {
    const { org } = this.props;
    try {
      if (org.id) {
        await org.updateManagePos();
      }
    } catch (e) {
      console.log(e);
    }
  };

  private onChangePosDonateAllowaceDDL = async (value: any) => {
    const { org } = this.props;
    if (value) {
      const specialPos = SpecialPosModel.create({
        type: "DonateAllowace",
        posId: value.id,
        posName: value.posName,
      });
      org.selectPosDonateAllowace(specialPos);
    } else {
      org.selectPosDonateAllowace();
    }
  };
  private onChangePosDonateDirectDDL = async (value: any) => {
    const { org } = this.props;
    if (value) {
      const specialPos = SpecialPosModel.create({
        type: "DonateDirect",
        posId: value.id,
        posName: value.posName,
      });
      org.selectPosDonateDirect(specialPos);
    } else {
      org.selectPosDonateDirect();
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28,
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14,
  },
};

export default withTranslation()(ManagePosForm);
