import { observer } from "mobx-react";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Divider, Form, Header, List, Segment } from "semantic-ui-react";
import {
  FactSheetModel,
  ICriteriaGroupModel,
  ICriteriaModel,
  IFactSheetItemModel
} from "../FactSheetModel";

interface IFactSheetScrollSum extends WithTranslation {
  factsheet: IFactSheetItemModel;
}

@observer
class FactSheetScrollSum extends Component<IFactSheetScrollSum> {
  public state = { factsheet: FactSheetModel.create({}) };
  public componentDidMount() {
    // const { factsheet } = this.props;
    // factsheet.loadFactSheet();
  }
  public render() {
    const { factsheet, t } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.loan.factSheetScrollSum.scoreEvaluationResults")}
          subheader={t("module.loan.factSheetScrollSum.assessedCriteria")}
        />
        <Form>
          {factsheet.credit_scroll_criteria.map(
            (cg: ICriteriaGroupModel, index: number) => (
              <Form.Field key={`CG${index}`}>
                <label>{cg.group_lable}</label>
                <Segment padded>
                  <List verticalAlign="middle">
                    {cg.criteria_list.map(
                      (item: ICriteriaModel, index: number) => (
                        <List.Item key={`CM${index}`}>
                          <List.Content floated="right">
                            {t("module.loan.factSheetScrollSum.score", {
                              value: item.result
                            })}
                          </List.Content>
                          <List.Content>
                            {`${index + 1}.  `}
                            {item.label}
                          </List.Content>
                        </List.Item>
                      )
                    )}
                    <Divider />
                    <List.Item>
                      <List.Content floated="right">
                        {t("module.loan.factSheetScrollSum.score", {
                          value: cg.summary_scroll
                        })}
                      </List.Content>
                      {cg.summary_scroll !== 0 ? (
                        <List.Content>
                          {cg.summary_scroll >= cg.pass_scroll ? (
                            <Header as="h3" color="green">
                              {t("module.loan.factSheetScrollSum.pass")}
                            </Header>
                          ) : (
                            <Header as="h3" color="red">
                              {t("module.loan.factSheetScrollSum.fail")}
                            </Header>
                          )}
                        </List.Content>
                      ) : null}
                    </List.Item>
                  </List>
                </Segment>
              </Form.Field>
            )
          )}
        </Form>
      </Segment>
    );
  }
}

export default withTranslation()(FactSheetScrollSum);
