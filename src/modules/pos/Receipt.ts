import moment from "moment";
import { IAppModel } from "../../AppModel";
import { IMAGES } from "../../constants";
import { calMainChar, convertFullMoney, mainCharLabel } from "../../utils";
import { currency, date_display_CE_TO_BE, date_To_Time } from "../../utils/format-helper";
import { EPosDevice } from "../../utils/printer-epson";
import { IReceiptItem, IReceiptModel, ReceiptModel } from "../receipt/ReceiptModel";
import { IPosModel } from "./PosModel";

let epos: any;

export const connectPrinter = async (pos: IPosModel, receipt: IReceiptModel) => {
  try {
    epos = new EPosDevice();
    await receipt.setField({ fieldname: "loading", value: true });
    await epos.connectPrinter(`${pos.printerIP}`, `${pos.printerPort}`);
  } catch (error) {
    receipt.error.setField({ fieldname: "tigger", value: true });
    receipt.error.setField({ fieldname: "code", value: "" });
    receipt.error.setField({
      fieldname: "title",
      value: "ไม่สามารถเชื่อมต่อเครื่องพิมพ์ได้",
    });
    receipt.error.setField({
      fieldname: "message",
      value: "กรุณาติดต่อเจ้าหน้าที่เพื่อตรวจสอบการตั้งค่าเครื่องพิมพ์ค่ะ",
    });
    receipt.error.setField({
      fieldname: "technical_stack",
      value: "",
    });
    throw error;
  } finally {
    receipt.setField({ fieldname: "loading", value: false });
  }
};

export const printFromTemplate = async (
  pos: IPosModel,
  receipt: IReceiptModel,
  recieptTempate: "PD" | "CL", /// PD : ใบเสร็จปกติ   CL : ใบเสร็จยกเลิก
  appStore: IAppModel,
  printedTime?: string
) => {
  epos = new EPosDevice();
  try {
    const printedDatetime = printedTime ? printedTime : moment().format();
    await receipt.setField({ fieldname: "loading", value: true });
    await epos.connectPrinter(`${pos.printerIP}`, `${pos.printerPort}`);
    // await epos.connectPrinter("192.168.1.75", "8008");
    // Create a print document
    epos.printer.addTextLang("th");
    // ------ Header----------
    printHeader(pos, receipt, printedDatetime);
    // -------- body ------------
    printBody(receipt);
    printBodySummary(pos, receipt, recieptTempate, appStore);
    printFooter(receipt);
    if (recieptTempate === "CL") {
      epos.printThai4Pass(`ผู้ยกเลิก ${pos.lastestPosShift.onDutymanager.fullname}`);
    } else {
      epos.printThai4Pass(`ผู้รับชำระ ${pos.lastestPosShift.currentCashier.fullname}`);
    }

    epos.printThai4Pass(`ผู้บันทึกรายการ ${pos.lastestPosShift.onDutymanager.fullname}`);
    printFooterLogo()
    epos.submit();
    return printedDatetime;
  } catch (error) {
    receipt.error.setField({ fieldname: "tigger", value: true });
    receipt.error.setField({ fieldname: "code", value: "" });
    receipt.error.setField({
      fieldname: "title",
      value: "ไม่สามารถเชื่อมต่อเครื่องพิมพ์ได้",
    });
    receipt.error.setField({
      fieldname: "message",
      value: "กรุณาติดต่อเจ้าหน้าที่เพื่อตรวจสอบการตั้งค่าเครื่องพิมพ์ค่ะ",
    });
    receipt.error.setField({
      fieldname: "technical_stack",
      value: "",
    });
    throw error;
  } finally {
    receipt.setField({ fieldname: "loading", value: false });
  }
};

const printHeader = (pos: IPosModel, receipt: IReceiptModel, printedDatetime: string) => {
  // No
  if (
    receipt.receiptItems.length &&
    (receipt.receiptItems[0].refType === "DA" || receipt.receiptItems[0].refType === "D")
  ) {
    epos.printThai4PassNo(`${mainCharLabel(`02`, 33, true)}`);
  } else if (receipt.receiptItems.length && receipt.receiptItems[0].refType === "AR") {
    epos.printThai4PassNo(`${mainCharLabel(`01`, 33, true)}`);
  } else if (receipt.receiptItems.length && (receipt.receiptItems[0].refType === "PR" || receipt.receiptItems[0].refType === "LR" || receipt.receiptItems[0].refType === "FR")) {
    epos.printThai4PassNo(`${mainCharLabel(`03`, 33, true)}`);
  } else {
    // epos.printThai4PassNo(`${mainCharLabel(`00`, 33, true)}`);
  }

  epos.printLineSpace();
  // logo
  printLogo();
  // label
  epos.setBigFont(false);
  epos.printThai4Pass("กองทุนผู้สูงอายุ");
  epos.printThai4Pass("กรมกิจการผู้สูงอายุ");
  // epos.printThai4Pass(
  //   `${mainCharLabel(`กระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์`, 30)}`
  // );
  epos.printThai4Pass(`${mainCharLabel(`${receipt.organizationName}`, 30, false, true)}`);
  epos.printThai4Pass(`POS:${pos.posCode}`);

  epos.printThai4Pass("ใบเสร็จรับเงิน");

  printHeaderAddress(
    `${mainCharLabel(`${receipt.organizationAddressLine1}`, 40)}`,
    `${mainCharLabel(`${receipt.organizationAddressLine2}`, 40)}`,
    `${mainCharLabel(`${receipt.organizationAddressLine3}`, 40)}`,
    `${mainCharLabel(`${receipt.organizationAddressLine4}`, 40)}`
  );
  // epos.printThai4Pass("Tax ID: 0994001013314");

  epos.printThai4Pass(
    `#${receipt.documentNumber} ${DateDisplayCeToBe(printedDatetime)} ${date_To_Time(printedDatetime, true)} ${pos.lastestPosShift.onDutymanagerIdLabel
    } ${pos.lastestPosShift.currentCashierIdLabel}`
  );
  epos.printLine();
};

const printBody = (receipt: IReceiptModel) => {
  receipt.receiptItems.forEach((item: IReceiptItem, index: number) => {
    switch (item.refType) {
      case "AR":
        printItem(
          `${item.name}`,
          `${mainCharLabel(`บัตรประชาชน ${item.ref1IdCardNo}`, 30)}` +
          `${mainCharLabel(`${currency(item.price, 2)}`, 10, true)}`,
          `${mainCharLabel(`หมายเลขอ้างอิงลูกหนี้ ` + `${item.ref2ArLabel}`, 40)}`,
          `${mainCharLabel(`รหัสจังหวัด/ปี/เลขที่สัญญา ` + `${item.ref3}`, 40)}`,
          `${mainCharLabel(item.description1, 40, false, true)}`,
          true
        );
        if (receipt.paymentMethod === "TRANSFER") {
          epos.printThai4Pass(`${mainCharLabel(`วันที่รับโอน ${date_display_CE_TO_BE(item.description2)}  ${item.description3}`, 40)} `);
        }

        break;
      case "D":
        printItem(
          item.ref1 === "D01" ? "เงินบริจาคสำหรับโครงการบริจาคเบี้ยยังชีพผู้สูงอายุ" : `${item.name}`,
          item.ref1 === "D01" ? "เข้ากองทุนผู้สูงอายุ" : ``,
          `${mainCharLabel(item.description1, 30)}` + `${mainCharLabel(`${currency(item.price, 2)}`, 10, true)}`,
          //item.description2 ? `${mainCharLabel(`หมายเหตุ:`, 30)}` : undefined,
          //item.description2 ? `${mainCharLabel(`${item.description2}`, 30)} ` : undefined,
          //false,
          //true,
          receipt.paymentMethod === "TRANSFER"
            ? `${mainCharLabel(`วันที่รับโอน ${date_display_CE_TO_BE(item.description3)}  ${item.description4}`, 40)} `
            : undefined
        );
        break;
      case "PR":
        printItem(
          `${item.name}`,
          `${mainCharLabel(`รหัสโครงการ ${item.ref1}`, 30)}`,
          //`${mainCharLabel(`${currency(item.price, 2)}`, 10, true)}`,
          `${item.description2} ` + `${item.ref2}`,
          receipt.paymentMethod === "TRANSFER"
            ? `${mainCharLabel(`วันที่รับโอน ${date_display_CE_TO_BE(item.description3)}  ${item.description4}`, 40)} `
            : undefined
        );
        // epos.printThai4Pass(
        //   `${mainCharLabel(`วันที่รับโอน ${date_display_CE_TO_BE(item.description3)}  ${item.description4}`, 40)} `
        // );
        break;
      case "LR":
        printItem(
          `${item.name}`,
          `${mainCharLabel(`${item.ref1}`, 30)}`,
          //`${mainCharLabel(`${currency(item.price, 2)}`, 10, true)}`,
          `${item.description2} ` + `${item.ref2}`,
          receipt.paymentMethod === "TRANSFER"
            ? `${mainCharLabel(`วันที่รับโอน ${date_display_CE_TO_BE(item.description3)}  ${item.description4}`, 40)} `
            : undefined
        );
        // epos.printThai4Pass(
        //   `${mainCharLabel(`วันที่รับโอน ${date_display_CE_TO_BE(item.description3)}  ${item.description4}`, 40)} `
        // );
        break;
      case "FR":
        printItem(
          `${item.name}`,
          `${mainCharLabel(`สำนักงานอัยการสูงสุด`, 30)}`,
          `${mainCharLabel(`${item.description1} ` + `${item.ref1}`, 30)}`,
          //`${mainCharLabel(`${currency(item.price, 2)}`, 10, true)}`,
          `${item.description2} ` + `${item.ref2}`,
          receipt.paymentMethod === "TRANSFER"
            ? `${mainCharLabel(`วันที่รับโอน ${date_display_CE_TO_BE(item.description3)}  ${item.description4}`, 40)} `
            : undefined
        );
        // epos.printThai4Pass(
        //   `${mainCharLabel(`วันที่รับโอน ${date_display_CE_TO_BE(item.description3)}  ${item.description4}`, 40)} `
        // );
        break;
      default:
        printItem(
          `${item.name}`,
          `${mainCharLabel(item.description1, 30)}` + `${mainCharLabel(`${currency(item.price, 2)}`, 10, true)}`,
          `${mainCharLabel(item.description2, 30)}`,
          `${mainCharLabel(item.description3, 30)}`,
          item.description4.trim() ? `${mainCharLabel(item.description4, 30)}` : undefined
        );
        break;
    }
  });
  // epos.printLineSpace();
};

const printBodySummary = (
  pos: IPosModel,
  receipt: IReceiptModel,
  recieptTempate: "PD" | "CL", /// PD : ใบเสร็จปกติ   CL : ใบเสร็จยกเลิก
  appStore: IAppModel
) => {
  epos.setTextLeft();
  epos.setBigFont(true);

  if (recieptTempate === "CL") {
    epos.printer.addTextStyle(0, 0, 0, epos.printer.COLOR_2);
    epos.printThai4Pass(`ยอดยกเลิก   -${currency(receipt.total, 2)}`);
    epos.printer.addTextStyle(0, 0, 0, epos.printer.COLOR_1);
    epos.setBigFont(false);
    epos.setTextCenter();
    epos.printThai4Pass(`( ${convertFullMoney(+receipt.total)} )`);
    epos.setTextRight();
    printSignature("ผู้รับเงินคืน");
    printSignature("  ผู้ยกเลิก", pos.lastestPosShift.onDutymanager.fullname);
    epos.printThai4Pass(`ตำแหน่ง ${pos.lastestPosShift.onDutymanager.position}`);
  } else {
    if (
      receipt.receiptItems.length &&
      (receipt.receiptItems[0].refType === "DA" || receipt.receiptItems[0].refType === "D")
    ) {
      epos.printThai4Pass(
        `${mainCharLabel(`ยอดบริจาค`, 8)}` + `${mainCharLabel(`${currency(receipt.total, 2)}`, 12, true)}`
      );
    } else {
      epos.printThai4Pass(
        `${mainCharLabel(`ยอดชำระ`, 7)}` + `${mainCharLabel(`${currency(receipt.total, 2)}`, 13, true)}`
      );
    }
    epos.setBigFont(false);
    epos.setTextCenter();
    epos.printThai4Pass(`( ${convertFullMoney(+receipt.total)} )`);
    epos.setTextRight();
    paymentMethodType(appStore, receipt);
    printSignature("ผู้รับเงิน", pos.lastestPosShift.currentCashier.fullname);
    epos.printThai4Pass(`ตำแหน่ง ${pos.lastestPosShift.currentCashier.position}`);
  }

  epos.printLine();
};

const printSignature = (titile: string, name?: string) => {
  epos.printLineSpace();
  epos.printLineSpace();
  epos.setTextCenter();
  epos.printThai4Pass(`${titile} ........................ `);
  epos.printThai4Pass(`( ${name ? name : "                    "} )`);
};

const printLogo = () => {
  console.log('printLogo')
  epos.printer.addTextAlign(epos.printer.ALIGN_CENTER);
  const { garuda_logo } = IMAGES;
  const canvas = document.createElement("canvas") as any;
  canvas.setAttribute("width", "64");
  canvas.setAttribute("height", "64");
  // canvas.setAttribute("width", "54");
  // canvas.setAttribute("height", "250");
  const context = canvas && canvas.getContext("2d");
  const logo = document.createElement("IMG") as any;
  logo.setAttribute("src", garuda_logo);
  logo.setAttribute("width", "64");
  // logo.setAttribute("height", "250");

  if (canvas && logo) {
    //epos.printThai4Pass(`${garuda_logo} (logo)`);
    context.drawImage(logo, +canvas.width / 2 - +logo.width / 2, 0, 64, 64);
    epos.printer.addImage(context, 0, 0, canvas.width, canvas.height);
  }

};
const printFooterLogo = () => {
  console.log('printFooterLogo')
  epos.printer.addTextAlign(epos.printer.ALIGN_CENTER);
  const { odf_w_text_logo } = IMAGES;
  const canvas = document.createElement("canvas") as any;
  canvas.setAttribute("width", "55");
  canvas.setAttribute("height", "70");
  // canvas.setAttribute("width", "54");
  // canvas.setAttribute("height", "250");
  const context = canvas && canvas.getContext("2d");
  const logo = document.createElement("IMG") as any;
  logo.setAttribute("src", odf_w_text_logo);
  logo.setAttribute("width", "55");
  // logo.setAttribute("height", "250");

  if (canvas && logo) {
    //epos.printThai4Pass(`${garuda_logo} (logo)`);
    context.drawImage(logo, +canvas.width / 2 - +logo.width / 2, 0, 55, 70);

    epos.printer.addImage(context, 0, 0, canvas.width, canvas.height);
  }

};
const printHeaderAddress = (line1: string, line2: string, line3: string, line4: string) => {
  const checkLine2to3 = calMainChar(line2.trim() + line3.trim());
  epos.setTextLeft();
  epos.printer.addTextFont(epos.printer.FONT_B);
  epos.printThai4Pass(line1);
  if (+checkLine2to3 <= 39) {
    epos.printThai4Pass(`${line2.trim() ? `${line2.trim()} ` : ""}${line3}`);
  } else {
    epos.printThai4Pass(line2);
    epos.printThai4Pass(line3);
  }
  epos.printThai4Pass(line4);
};
const printFooter = (receipt: IReceiptModel) => {
  if (
    receipt.receiptItems.length &&
    (receipt.receiptItems[0].refType === "DA" || receipt.receiptItems[0].refType === "D")
  ) {
    epos.setTextCenter();
    epos.printThai4Pass("ใบเสร็จรับเงินฉบับนี้สามารถนำไปหักลดหย่อนภาษี");
    epos.printThai4Pass("ได้ตามประมวลรัษฎากร");
  }
  epos.setTextLeft();

  if (
    receipt.receiptItems.length &&
    (receipt.receiptItems[0].refType === "DA" || receipt.receiptItems[0].refType === "D")
  ) {
  } else {
    epos.printThai4Pass("สอบถามยอดค้าง,ยืนยันยอด,วงเงิน,ข้อมูลใบแจ้งหนี้");
  }
  epos.printThai4Pass("**ติดต่อ กองทุนผู้สูงอายุ");

  epos.setBigFont(true);
  epos.printThai4Pass(`โทร.${receipt.organization.telephone}`); // org
  epos.printer.addTextDouble(false, false);
  epos.setTextCenter();
  epos.printThai4Pass("โปรดตรวจสอบรายการทุกครั้งเพื่อความถูกต้อง");
  epos.printer.addTextStyle(0, 0, 1, epos.printer.COLOR_2);
  if (
    receipt.receiptItems.length &&
    (receipt.receiptItems[0].refType === "DA" || receipt.receiptItems[0].refType === "D")
  ) {
    epos.printThai4Pass("**เอกสารสำคัญโปรดเก็บไว้เป็นหลักฐานในการบริจาค");
  } else {
    epos.printThai4Pass("**เอกสารสำคัญโปรดเก็บไว้เป็นหลักฐานในการชำระ");
  }
  epos.printer.addTextStyle(0, 0, 0, epos.printer.COLOR_1);
};
const printItem = (
  name: string,
  line1: string,
  line2?: string,
  line3?: string,
  line4?: string,
  line4Special?: boolean,
  specialStyleLine1?: boolean,
  line5?: string
) => {
  epos.printer.addTextAlign(epos.printer.ALIGN_LEFT);
  epos.printer.addTextStyle(0, 0, 1, epos.printer.COLOR_1);
  // printer.addTextDouble(true, true);
  epos.printThai4Pass(name);
  epos.printer.addTextStyle(0, 0, 0, epos.printer.COLOR_1);
  // printer.addTextDouble(false, false);
  if (line1) {
    if (specialStyleLine1) {
      epos.printer.addTextStyle(0, 0, 1, epos.printer.COLOR_1);
      epos.printThai4Pass(line1);
      epos.printer.addTextStyle(0, 0, 0, epos.printer.COLOR_1);
    } else {
      epos.printThai4Pass(line1);
    }
  }
  if (line2) {
    epos.printThai4Pass(line2);
  }
  if (line3) {
    epos.printThai4Pass(line3);
  }
  if (line4) {
    epos.printThai4Pass(line4, line4Special);
  }
  if (line5) {
    epos.printThai4Pass(line5);
  }
  // epos.printLineSpace();

};

const DateDisplayCeToBe = (value: any) => {
  const date = moment(value);
  return date.isValid() ? date.locale("es").add("years", 543).format("DD[/]MM[/]YYYY") : "-";
};

const paymentMethodType = (appStore: IAppModel, receipt: IReceiptModel) => {
  switch (receipt.paymentMethod) {
    case "CASH":
      // epos.printThai4Pass(
      //   `${mainCharLabel(
      //     `${appStore.enumItemLabel("officePaymentMethod", "CASH")} `,
      //     30,
      //     true
      //   )}` +
      //     `${mainCharLabel(`${currency(receipt.paidAmount, 2)}`, 10, true)}`
      // );
      epos.printThai4Pass(
        `${mainCharLabel(`เงินสด/เงินทอน`, 12)}` +
        `${mainCharLabel(`${currency(receipt.paidAmount, 2)}`, 14, true)}` +
        `${mainCharLabel(`${currency(receipt.changeAmount, 2)}`, 14, true)}`
      );
      break;
    case "TRANSFER":
      epos.printThai4Pass(
        `${mainCharLabel(`เงินรับโอน`, 8)}` + `${mainCharLabel(`${currency(receipt.paidAmount, 2)}`, 32, true)}`
      );
      break;
    case "MONEYORDER":
      epos.printThai4Pass(
        `${mainCharLabel(`${appStore.enumItemLabel("officePaymentMethod", "MONEYORDER")} `, 20)}` +
        `${mainCharLabel(`${currency(receipt.paidAmount, 2)}`, 20, true)}`
      );
      epos.setTextLeft();
      epos.printThai4Pass(`${mainCharLabel(`เลขที่ ${receipt.paymentRefNo}`, 40)}`);
      epos.printThai4Pass(`${mainCharLabel(`วันที่ ${date_display_CE_TO_BE(receipt.paidDate)}`, 40)}`);
      break;
    case "CHECK":
      epos.printThai4Pass(
        `${mainCharLabel(`${appStore.enumItemLabel("officePaymentMethod", "CHECK")} `, 40)}` +
        `${mainCharLabel(`${currency(receipt.paidAmount, 2)}`, 40, true)}`
      );

      const checkBankBranch = calMainChar(
        appStore.enumItemLabel("bank", receipt.paymentBank) + `สาขา ${receipt.paymentBankBranch}`
      );
      epos.setTextLeft();
      if (+checkBankBranch > 39) {
        epos.printThai4Pass(`${mainCharLabel(`${appStore.enumItemLabel("bank", receipt.paymentBank)}`, 40, true)}`);
        epos.printThai4Pass(`${mainCharLabel(`${`สาขา ${receipt.paymentBankBranch}`}`, 40, true)}`);
      } else {
        epos.printThai4Pass(
          `${mainCharLabel(
            `${appStore.enumItemLabel("bank", receipt.paymentBank)} ${`สาขา ${receipt.paymentBankBranch}`}`,
            40,
            true
          )}`
        );
      }

      const checkCHECKNo = calMainChar(`${receipt.paymentRefNo}`);
      if (checkCHECKNo > 15) {
        epos.printThai4Pass(`${mainCharLabel(`เลขที่ ${receipt.paymentRefNo}`, 40)}`);
        epos.printThai4Pass(`${mainCharLabel(`วันที่ ${date_display_CE_TO_BE(receipt.paidDate)}`, 40)}`);
      } else {
        epos.printThai4Pass(
          `${mainCharLabel(
            `เลขที่ ${receipt.paymentRefNo} ${`วันที่ ${date_display_CE_TO_BE(receipt.paidDate)}`}`,
            40,
            true
          )}`
        );
      }
      break;
    default:
      epos.printThai4Pass(
        `${mainCharLabel(`- `, 30, true)}` + `${mainCharLabel(`${currency(receipt.paidAmount, 2)}`, 10, true)}`
      );
      break;
  }
};

export const printReceipt = async (receipt: IReceiptModel, pos: IPosModel, appStore: any, t: any) => {
  const receiptTemp = ReceiptModel.create({});
  await receiptTemp.setAllField(receipt.receiptJSON);
  try {
    let recieveByName = "";
    if (pos.lastestPosShift && pos.lastestPosShift.onDutymanager) {
      recieveByName = pos.lastestPosShift.onDutymanager.fullname;
    }
    await receiptTemp.setOrganizationName(receiptTemp.organization);
    await receiptTemp.setOrganizationAddress(receiptTemp.organization.address);
    let printedDatetime = moment().format();
    if (receiptTemp.status === "CL") {
      printedDatetime = await printFromTemplate(pos, receiptTemp, "CL", appStore);
      if (receiptTemp.receiptPrintLogs.length) {
        await receiptTemp.createReceiptPrintLog(printedDatetime, "CLR");
      } else {
        await receiptTemp.createReceiptPrintLog(printedDatetime, "CL");
      }
    } else {
      printedDatetime = await printFromTemplate(pos, receiptTemp, "PD", appStore);
      if (receiptTemp.receiptPrintLogs.length) {
        await receiptTemp.createReceiptPrintLog(printedDatetime, "RP");
      } else {
        await receiptTemp.createReceiptPrintLog(printedDatetime, "IP");
      }
    }
    receiptTemp.setField({ fieldname: "loading", value: true });
    await setTimeout(() => {
      receiptTemp.resetAll();
    }, 5000);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
