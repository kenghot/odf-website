import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AgreementHeader } from ".";
import { ILocationModel } from "../../../../components/address/LocationModel";
import { IRequestListModel } from "../../request/RequestListModel";
import { IAgreementModel } from "../AgreementModel";
import AgreementFormBody from "./AgreementFormBody";

interface IAgreementFormEdit extends WithTranslation {
  agreement: IAgreementModel;
  locationStore: ILocationModel;
  requestList: IRequestListModel;
}
@observer
class AgreementFormEdit extends React.Component<IAgreementFormEdit> {
  public render() {
    const { agreement, locationStore, requestList } = this.props;
    return (
      <Segment padded="very">
        <AgreementHeader agreement={agreement} disableEditBtn />
        <Form onSubmit={agreement.updateAgreement}>
          <AgreementFormBody
            agreement={agreement}
            locationStore={locationStore}
            requestList={requestList}
          />
        </Form>
      </Segment>
    );
  }
}

export default withTranslation()(AgreementFormEdit);
