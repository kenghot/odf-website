import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Grid, Input, Pagination } from "semantic-ui-react";

export interface ITableFooter extends WithTranslation {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
  onChangePerPage: (value: number) => void;
  onChangeCurrentPage: (value: number) => void;
}

class TableFooter extends React.Component<ITableFooter> {
  public render() {
    const {
      currentPage,
      totalPages,
      total,
      perPage,
      onChangeCurrentPage,
      onChangePerPage,
      t
    } = this.props;
    return (
      <Grid verticalAlign="middle">
        <Grid.Row>
          <Grid.Column floated="left" computer={3} tablet={16}>
            {t("component.tableFooter.total", {
              value: total
            })}
          </Grid.Column>
          <Grid.Column textAlign="center" computer={4} tablet={16}>
            {t("component.tableFooter.show")}
            <Input
              type="number"
              floated="right"
              style={style.input}
              value={perPage}
              onChange={(event: any, data: any) =>
                this.onChangePerPage(data.value)
              }
              min="1"
            />
            {t("component.tableFooter.list")}
          </Grid.Column>
          <Grid.Column
            floated="right"
            textAlign="right"
            computer={9}
            tablet={16}
          >
            <Pagination
              size="mini"
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              activePage={currentPage}
              onPageChange={(e, data) =>
                this.onChangeCurrentPage(
                  data && data.activePage ? data.activePage.toString() : ""
                )
              }
              totalPages={total > 0 ? totalPages : 1}
            />
            {t("component.tableFooter.goToPage")}
            <Input
              type="number"
              floated="right"
              style={style.input}
              value={currentPage}
              onChange={(event: any, data: any) =>
                this.onChangeCurrentPage(data.value)
              }
              min="1"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  private onChangeCurrentPage = (value: string) => {
    const { total, totalPages, onChangeCurrentPage } = this.props;
    if (+value >= totalPages && total > 0) {
      onChangeCurrentPage(totalPages);
    } else {
      onChangeCurrentPage(parseInt(+value && total > 0 ? value : "1"));
    }
  };
  private onChangePerPage = (value: string) => {
    const { onChangePerPage } = this.props;
    if (+value > 0) {
      onChangePerPage(parseInt(value));
    } else {
      onChangePerPage(1);
    }
  };
}
const style = {
  input: {
    width: "100px",
    padding: "0 5px"
  }
};

export default withTranslation()(TableFooter);
