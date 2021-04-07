import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Label, SemanticSIZES } from "semantic-ui-react";
import { date_To_Time, dateTime_display_CE_TO_BE } from "../../../utils";

export interface ITimeRangeLabel extends WithTranslation {
  size?: SemanticSIZES;
  started?: string;
  ended?: string;
  showDateTime?: boolean;
}

class TimeRangeLabel extends React.Component<ITimeRangeLabel> {
  public render() {
    const { t, size, started, ended, showDateTime } = this.props;
    const startValue = showDateTime! ? dateTime_display_CE_TO_BE(started, true) : date_To_Time(started, true);
    const endValue = showDateTime! ? dateTime_display_CE_TO_BE(ended, true) : date_To_Time(ended, true)
    return (
      <React.Fragment>
        {`${started ? `${startValue}  -  ` : ""}`}
        {started && !ended ? (
          <Label size={size || "mini"} color="blue">
            {t("module.pos.posStatusHeader.startedisOnlineShift")}
          </Label>
        ) : (
            `${ended ? endValue : ""}`
          )}
      </React.Fragment>
    );
  }
}
export default withTranslation()(TimeRangeLabel);
