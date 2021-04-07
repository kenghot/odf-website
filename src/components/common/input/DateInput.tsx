import jQuery from "jquery";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import { Input, Icon } from "semantic-ui-react";

interface IDateInput extends WithTranslation {
  value: any;
  fieldName: any;
  id?: string;
  formatdate?: string;
  isNotBEYear?: boolean;
  type?: string;
  fluid?: boolean;
  clearable?: boolean;
  onChangeInputField?: (fieldName: string, value: any) => void;
  onBlur?: () => void;
}

@observer
class DateInput extends React.Component<IDateInput> {
  public dateInput: React.RefObject<any>;
  constructor(props: any) {
    super(props);

    this.dateInput = React.createRef();
  }

  public state = { date: "" };
  public componentDidUpdate() {
    const { id, value, fieldName } = this.props;
    const objId = `#${id ? id + "_" + fieldName : fieldName}`;
    jQuery(objId).calendar("set date", value, true, false);
  }

  public componentDidMount() {
    const {
      value,
      fieldName,
      id,
      formatdate,
      isNotBEYear,
      onChangeInputField,
      type
    } = this.props;

    const finalFormat = formatdate ? formatdate : "DD MMM YYYY";
    const objId = `#${id ? id + "_" + fieldName : fieldName}`;
    jQuery(objId).calendar({
      type: type || "date",
      inline: false,
      today: type !== "year",
      formatInput: "YYYY-MM-DD",
      closable: true,

      formatter: {
        date(date: any, settings: any) {
          if (!date) return "";
          const tempDate = moment(date);
          const momentDate = isNotBEYear ? tempDate : tempDate.add(543, "year");
          return `${momentDate.format(finalFormat)}`;
        },
        dayHeader(date: any, settings: any) {
          // return a string to show on the header for the given 'date' in day mode
          if (!date) return "";
          return `${moment(date)
            .add(543, "year")
            .format("MMM YYYY")}`;
        },
        monthHeader(date: any, settings: any) {
          // return a string to show on the header for the given 'date' in month mode
          if (!date) return "";
          return `${moment(date)
            .add(543, "year")
            .format("YYYY")}`;
        },
        yearHeader(date: any, settings: any) {
          // return a string to show on the header for the given 'date' in year mode
          if (!date) return "";
          return `${moment(date)
            .add(535, "year")
            .format("YYYY")} - ${moment(date)
            .add(546, "year")
            .format("YYYY")}`;
        },
        cell(cell: any, date: any, cellOptions: any) {
          if (cellOptions.mode === "year") {
            cell[0].innerText = `${moment(date)
              .add(543, "year")
              .format("YYYY")}`;
          }
        }
      },
      // callback when date changes, return false to cancel the change
      onChange(date: any, text: any, mode: any) {
        const temp = React.createElement(DateInput, {
          name: "DateInput",
          value,
          fieldName,
          id,
          formatdate,
          isNotBEYear,
          onChangeInputField
        }) as any;
        const dateinput: any = ReactDOM.render(temp, jQuery("#temp")[0]);
        if (dateinput) {
          dateinput.onChangeDate(date);
        }
      },
      text: {
        days: ["อ.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
        months: [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิการยน",
          "ธันวาคม"
        ],
        monthsShort: [
          "ม.ค.",
          "ก.พ.",
          "มี.ค.",
          "เม.ย.",
          "พ.ค.",
          "มิ.ย.",
          "ก.ค.",
          "ส.ค.",
          "ก.ย.",
          "ต.ค.",
          "พ.ย.",
          "ธ.ค."
        ],
        today: "วันนี้",
        now: type === "month" ? "เดือนปัจุบัน" : "เวลาปัจุบัน",
        am: "AM",
        pm: "PM"
      }
    });
  }

  private setPlaceholder() {
    const { type } = this.props;
    let placeholder = "";
    switch (type) {
      case "year":
        placeholder = "กรุณาระบุปี";
        break;
      case "month":
        placeholder = "กรุณาระบุเดือน";
        break;
      default:
        placeholder = "กรุณาระบุวันที่";
        break;
    }
    return placeholder;
  }

  public render() {
    const { value, fieldName, id, type, fluid, clearable, onBlur } = this.props;
    return (
      <div>
        <div id="temp" style={{ display: "none" }} />
        <div
          className="ui calendar"
          id={`${id ? id + "_" + fieldName : fieldName}`}
          ref={this.dateInput}
        >
          <div className="ui input" style={fluid ? { width: "100%" } : {}}>
            <Input
              id={`input-${id ? id + "_" + fieldName : fieldName}`}
              type="text"
              placeholder={this.setPlaceholder()}
              readOnly
              value={value || ""}
              icon={
                clearable && value ? (
                  <Icon name="x" link onClick={this.onClickClear} />
                ) : (
                  <Icon name="calendar alternate outline" />
                )
              }
              onBlur={onBlur}
              style={fluid ? { width: "100%" } : {}}
            />
          </div>
        </div>
      </div>
    );
  }

  private onChangeDate = (date: any) => {
    const { onChangeInputField, fieldName } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(fieldName, moment(date).format("YYYY-MM-DD"));
    }
  };

  private onClickClear = () => {
    const { onChangeInputField, fieldName } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(fieldName, "");
    }
  };
}

export default withTranslation()(DateInput);
