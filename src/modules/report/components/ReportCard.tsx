import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Grid, Segment } from "semantic-ui-react";
import { Text } from "../../../components/common";

interface IReportCard extends WithTranslation {
  title: string;
  filter?: any;
  onGetReport: () => void;
}

@observer
class ReportCard extends React.Component<IReportCard> {
  public state = { loading: false };
  public render() {
    const { title, filter, t } = this.props;
    return (
      <Segment
        size={"mini"}
        padded
        loading={this.state.loading}
        style={style.borderLeft}
      >
        <Grid columns="equal" stackable doubling>
          <Grid.Column>
            <Grid columns="equal">
              <Grid.Row>
                <Grid.Column width={10}>
                  <Text shade={2}>{title}</Text>
                </Grid.Column>
                <Grid.Column textAlign={"right"} width={6}>
                  <Button
                    color="blue"
                    content={t("module.report.reportCard.getReport")}
                    icon="print"
                    labelPosition="left"
                    onClick={this.onGetReport}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>{filter}</Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }

  private onGetReport = async () => {
    const { onGetReport } = this.props;
    try {
      this.onSetLoading(true);
      await onGetReport();
    } catch (e) {
      console.log(e);
    } finally {
      this.onSetLoading(false);
    }
  };

  private onSetLoading = (loading: boolean) => {
    this.setState({ loading });
  };
}

const style = {
  borderLeft: {
    borderLeftStyle: "solid",
    borderLeftWidth: "6px",
    borderLeftColor: "#a5673f"
  }
};

export default withTranslation()(ReportCard);
