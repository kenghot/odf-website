import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Icon, Label, Segment } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { RequesFormHeader, RequestFormBody } from ".";
import { IAppModel } from "../../../../AppModel";
import { IRequestModel } from "../RequestModel";

interface IRequestFormCreate extends WithTranslation {
  request: IRequestModel;
  appStore?: IAppModel;
  mode: "editMode" | "createMode";
}
@inject("appStore")
@observer
class RequestFormCreate extends React.Component<IRequestFormCreate> {
  public render() {
    const { request, mode } = this.props;
    return (
      <Segment padded basic>
        <Grid columns="equal" style={styles.header}>
          <Grid.Row verticalAlign="top" id="headerElement">
            {this.renderTitleRow()}
          </Grid.Row>
        </Grid>
        <Form>
          <RequesFormHeader request={request} />
          <RequestFormBody request={request} mode={mode} />
        </Form>
      </Segment>
    );
  }
  private renderTitleRow() {
    const { request, appStore, t } = this.props;
    return (
      <React.Fragment>
        <Grid.Column>
          <Header
            size="medium"
            content={t("module.loan.requestDetail.createRequestForm")}
            subheader={request.name || ""}
          />
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          {request.status ? (
            <Button as="div" labelPosition="right" style={styles.icon}>
              <Button icon color="blue" style={styles.icon}>
                <Icon name="circle" />
              </Button>
              <Label basic color="blue">
                {appStore!.enumItemLabel("requestStatus", request.status)}
              </Label>
            </Button>
          ) : null}
        </Grid.Column>
      </React.Fragment>
    );
  }
}

const styles: any = {
  header: {
    marginBottom: 14
  },
  buttom: {
    marginTop: 23
  }
};

export default withTranslation()(RequestFormCreate);
