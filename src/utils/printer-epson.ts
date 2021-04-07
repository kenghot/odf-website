import iconv from "iconv-lite";
import { validateLower, validateUpper } from "./thai-format-helper";

const epson = (window as any).epson;

export class EPosDevice {
  public ePosDev: any;
  public printer: any;
  constructor() {
    this.ePosDev = new epson.ePOSDevice();
  }
  public connectPrinter(ipAddress: string, port: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ePosDev.connect(ipAddress, port, (resultConnect: string) => {
        const deviceId = "local_printer";
        const options = { crypto: false, buffer: true };
        if (resultConnect === "OK" || resultConnect === "SSL_CONNECT_OK") {
          console.log("resultConnect ==>", resultConnect);
          // Retrieves the Printer object
          this.ePosDev.createDevice(
            deviceId,
            this.ePosDev.DEVICE_TYPE_PRINTER,
            options,
            (deviceObject: any, code: any) => {
              if (deviceObject === null) {
                // Displays an error message if the system fails to retrieve the Printer object
                return reject(code);
              }
              // Registers the print complete event
              deviceObject.onreceive = (response: any) => {
                if (response.success) {
                  // Displays the successful print message
                  // console.log(response);
                } else {
                  // Displays error messages
                }
              };
              this.printer = deviceObject;
              return resolve();
            }
          );
        } else {
          // Displays error messages
          // console.log(resultConnect);
          return reject(resultConnect);
        }
      });
    });
  }

  public printThai4Pass(text: string, underline?: boolean) {
    const [line1, line2, line3, line4] = this.splitThai4Pass(text.trim());

    if (line1.trim() !== "") {
      this.printer.addTextLineSpace(3);
      this.printer.addText(line1 + "\n");
    }
    if (line2.trim() !== "") {
      this.printer.addTextLineSpace(8);
    } else {
      this.printer.addTextLineSpace(6);
    }
    this.printer.addText(line2 + "\n");

    if (line3.trim() !== "") {
      this.printer.addTextLineSpace(8);
      if (underline) {
        this.printer.addTextStyle(0, 1, 1);
        this.printer.addText(line3 + "\n");
        this.printer.addTextStyle(0, 0, 0);
      } else {
        this.printer.addText(line3 + "\n");
      }
    }
    if (line4.trim() !== "") {
      this.printer.addTextLineSpace(1);
      this.printer.addText(line4 + "\n");
    }
  }

  public printThai4PassNo(text: string, underline?: boolean) {
    const [line1, line2, line3, line4] = this.splitThai4Pass(text);

    if (line1 !== "") {
      this.printer.addTextLineSpace(3);
      this.printer.addText(line1 + "\n");
    }
    if (line2 !== "") {
      this.printer.addTextLineSpace(8);
    } else {
      this.printer.addTextLineSpace(6);
    }
    this.printer.addText(line2 + "\n");

    if (line3 !== "") {
      this.printer.addTextLineSpace(8);
      if (underline) {
        this.printer.addTextStyle(0, 1, 1);
        this.printer.addText(line3 + "\n");
        this.printer.addTextStyle(0, 0, 0);
      } else {
        this.printer.addText(line3 + "\n");
      }
    }
    if (line4 !== "") {
      this.printer.addTextLineSpace(1);
      this.printer.addText(line4 + "\n");
    }
  }

  public printLine() {
    this.printer.addTextLineSpace(4);
    this.printer.addText("\n----------------------------------------\n");
  }
  public printLineSpace() {
    this.printer.addTextLineSpace(8);
    this.printer.addFeedLine(1);
  }
  public submit() {
    this.printer.addCut(this.printer.CUT_FEED);
    this.printer.send();
  }
  public setBigFont(value: boolean) {
    this.printer.addTextDouble(value, value);
  }
  public setTextRight() {
    this.printer.addTextAlign(this.printer.ALIGN_RIGHT);
  }
  public setTextLeft() {
    this.printer.addTextAlign(this.printer.ALIGN_LEFT);
  }
  public setTextCenter() {
    this.printer.addTextAlign(this.printer.ALIGN_CENTER);
  }
  private splitThai4Pass = (s: string) => {
    const ascii = iconv.encode(s, "TIS-620");
    // console.log(ascii);
    const line1 = [];
    const line2 = [];
    const line3 = [];
    const line4 = [];
    let count = -1;
    // count main charecter
    for (let i = 0; i < ascii.length; i++) {
      // console.log(`c: ${string[i]}`, ` code:${ascii[i]}`)
      if (!(validateUpper(ascii[i]) || validateLower(ascii[i]))) {
        count += 1;
        line1[count] = " ";
        line2[count] = " ";
        line3[count] = s[i];
        line4[count] = " ";
      } else if (validateUpper(ascii[i])) {
        if (validateUpper(ascii[i - 1])) {
          line1[count] = s[i];
        } else {
          line2[count] = s[i];
        }
      } else {
        line4[count] = s[i];
      }
    }
    return [line1.join(""), line2.join(""), line3.join(""), line4.join("")];
  };
}
