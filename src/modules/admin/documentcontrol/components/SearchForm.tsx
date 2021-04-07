import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "../../../../components/common";
import { FiscalYearDDL } from "../../../../components/project/year";
import { SEQUENCE_TYPE } from "../../../../constants/SELECTOR";
import { ISequenceListModel } from "../../sequence/SequenceListModel";

interface ISearchForm extends WithTranslation {
  sequenceListStore: ISequenceListModel;
}

@observer
class SearchForm extends React.Component<ISearchForm> {
  public render() {
    const { t, sequenceListStore } = this.props;
    const statusOptions = SEQUENCE_TYPE;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.searchForm.searchListDocumentNumbers")}
          subheader={t("module.admin.searchForm.browseAgencyInformation")}
          style={styles.header}
        />
        <Form size="mini">
          <Form.Group widths="equal">
            <Form.Select
              id="form-input-ddl-searchform-sequence-type"
              search
              fluid
              label={t("module.admin.searchForm.documentType")}
              options={statusOptions}
              placeholder={t("module.admin.searchForm.pleaseSelect")}
              onChange={(event, data) =>
                this.onChangeInputField("filterSequenceType", data.value)
              }
              value={sequenceListStore.filterSequenceType}
            />

            <Form.Field
              id="form-input-ddl-searchform-fiscal-year"
              label={t("module.admin.searchForm.fiscalYear")}
              placeholder={t("module.admin.searchForm.pleaseSelect")}
              control={FiscalYearDDL}
              onChange={this.onChangeFiscalYearDDL}
              value={sequenceListStore.filterPrefixYear}
            />
            <Form.Input
              id="form-input-searchform-prefix-code"
              fluid
              label={t("module.admin.searchForm.shortcode")}
              placeholder={t("module.admin.searchForm.specifyShortcode")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("filterPrefixCode", data.value)
              }
              value={sequenceListStore.filterPrefixCode}
            />
          </Form.Group>
        </Form>
        <Grid columns="equal">
          <Grid.Row verticalAlign="middle">
            <Grid.Column textAlign="right">
              <Link
                id="btn-reset-filters"
                shade={5}
                style={styles.link}
                onClick={() => this.resetFilter()}
              >
                {t("module.admin.searchForm.cancelAllFilters")}
              </Link>
              <Button
                id="btn-search-filters"
                icon
                labelPosition="left"
                color="blue"
                style={styles.button}
                onClick={() => {
                  sequenceListStore.setField({
                    fieldname: "currentPage",
                    value: 1
                  });
                  sequenceListStore.load_data();
                }}
              >
                {t("module.admin.searchForm.searching")}
                <Icon name="search" />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private resetFilter = async () => {
    const { sequenceListStore } = this.props;
    await sequenceListStore.resetFilter();
    await sequenceListStore.load_data();
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { sequenceListStore } = this.props;
    sequenceListStore.setField({ fieldname, value });
  };
  private onChangeFiscalYearDDL = (value: string) => {
    const { sequenceListStore } = this.props;
    sequenceListStore.setField({ fieldname: "filterPrefixYear", value });
  };
}

const styles: any = {
  link: {
    cursor: "pointer"
  },
  button: {
    marginRight: 0,
    marginLeft: 14
  },
  header: {
    marginBottom: 28
  }
};

export default withTranslation()(SearchForm);
