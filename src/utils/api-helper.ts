import { default as request } from "./request-helper";

export interface IApiResponse {
  success: string;
  data: any;
  error: string[];
  headers: any;
}
export interface IResource {
  name?: string;
  id?: string | number;
}
export class ApiHelper {
  constructor(protected url = "") {
    this.url = url;
  }
  public setUrl(url: string) {
    this.url = url;
  }
  public async get(queries?: any, resource?: IResource): Promise<IApiResponse> {
    try {
      const url = resource ? `${this.url}/${resource.name}` : this.url;
      const result = await request.get(url, { queries });
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async getById(
    id: string,
    resource?: IResource
  ): Promise<IApiResponse> {
    try {
      const baseUrl = `${this.url}/${id}`;
      const url = resource ? `${baseUrl}/${resource.name}` : baseUrl;
      const result = await request.get(url, {});
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async create(body: any, resource?: IResource): Promise<IApiResponse> {
    try {
      const baseUrl = this.url;
      const url = resource ? `${baseUrl}/${resource.name}` : baseUrl;
      const result = await request.post(url, { body });
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async update(body: any, id: any): Promise<IApiResponse> {
    const url = `${this.url}/${id}`;
    try {
      const result = await request.put(url, { body });
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async formCreate(body: any, id?: any): Promise<IApiResponse> {
    const url = `${this.url}${id ? `/${id}` : ""}`;
    try {
      const formBody: FormData = this.createFormData(body);
      const result = await request.formPost(url, formBody);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async formUpdate(body: any, id: any): Promise<IApiResponse> {
    const url = `${this.url}/${id}`;
    try {
      const formBody: FormData = this.createFormData(body);
      const result = await request.formPut(url, formBody);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async formUpdateResource(
    body: any,
    id: number,
    resource?: IResource
  ): Promise<IApiResponse> {
    const url = resource
      ? `${this.url}/${id}/${resource.name}`
      : `${this.url}/${id}`;
    try {
      const formBody: FormData = this.createFormData(body);
      const result = await request.formPut(url, formBody);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async formUpdateNoId(
    body: any,
    resource?: IResource
  ): Promise<IApiResponse> {
    const baseUrl = this.url;
    const url = resource ? `${baseUrl}/${resource.name}` : baseUrl;
    try {
      const formBody: FormData = this.createFormData(body);
      const result = await request.formPut(url, formBody);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async delete(id: number, body?: any): Promise<IApiResponse> {
    const url = `${this.url}/${id}`;
    try {
      const result = await request.delete(url, { body });
      return result;
    } catch (e) {
      throw e;
    }
  }
  private createFormData(
    object: any,
    form?: FormData,
    namespace?: string
  ): FormData {
    const formData = form || new FormData();
    for (const property in object) {
      if (!object.hasOwnProperty(property) || !object[property]) {
        continue;
      }
      const formKey = namespace ? `${namespace}[${property}]` : property;
      if (object[property] instanceof Date) {
        formData.append(formKey, object[property].toISOString());
      } else if (
        typeof object[property] === "object" &&
        !(object[property] instanceof File)
      ) {
        this.createFormData(object[property], formData, formKey);
      } else if (object[property] instanceof Array) {
        const list = object[property];
        list.forEach((item: any, index: number) => {
          this.createFormData(item, formData, formKey);
        });
      } else {
        formData.append(formKey, object[property]);
      }
    }
    return formData;
  }
}
