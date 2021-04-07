import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Checkbox, Grid, Header, Icon } from "semantic-ui-react";
import { MapModal } from "../../../../modals";
import { IValidationItemModel } from "../ValidationModel";

interface IValidationItems extends WithTranslation {
  checkListItem: IValidationItemModel[];
  precoditionCheck?: boolean;
  requestItemsIndex?: number;
}

@observer
class ValidationItems extends React.Component<IValidationItems> {
  public render() {
    const {
      checkListItem,
      precoditionCheck,
      requestItemsIndex,
      t
    } = this.props;
    return (
      <Grid columns={"equal"} padded>
        <Grid.Row>
          <Grid.Column width={10}>
            <Header>{t("module.loan.validationItems.consideration")}</Header>
          </Grid.Column>
          <Grid.Column>
            <Header>{t("module.loan.validationItems.support")}</Header>
          </Grid.Column>
        </Grid.Row>
        {checkListItem.map((item: IValidationItemModel, index: number) => {
          const supportedValue = item.getSupportedValue(
            requestItemsIndex,
            precoditionCheck
          );
          return (
            <Grid.Row key={index}>
              <Grid.Column width={10}>
                <Checkbox
                  key={item.key}
                  label={item.label}
                  defaultChecked={item.value}
                  onChange={(e: any, val: any) =>
                    item.setField({ fieldname: "value", value: val.checked })
                  }
                />
              </Grid.Column>
              {item.supported_label && item.supported_value ? (
                <Grid.Column>
                  {item.supported_value_type === "MAP"
                    ? this.renderMap(supportedValue)
                    : `${
                        item.supported_label
                      }: ${supportedValue} ${item.supported_suffix || ""}`}
                </Grid.Column>
              ) : null}
            </Grid.Row>
          );
        })}
      </Grid>
    );
  }
  private renderMap(supportedValue: any) {
    const { t } = this.props;
    return supportedValue.latitude && supportedValue.longitude ? (
      <MapModal
        address={supportedValue}
        trigger={
          <Button color="red" type="button">
            <Icon name="map marker alternate" />
            {t("module.loan.components.diagram")}
          </Button>
        }
      />
    ) : (
      t("module.loan.components.noMap")
    );
  }
}

export default withTranslation()(ValidationItems);
