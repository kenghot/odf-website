import { ApiHelper, IApiResponse } from "../../utils/api-helper";

const subdistrictUrl = `${
  process.env.REACT_APP_API_ENDPOINT
}/config/sub_districts`;
const districtUrl = `${process.env.REACT_APP_API_ENDPOINT}/config/districts`;
const provinceUrl = `${process.env.REACT_APP_API_ENDPOINT}/config/provinces`;

class LocationService extends ApiHelper {
  public async search(search?: string): Promise<IApiResponse | void> {
    try {
      let result: any;
      if (search) {
        result = await this.get({ search_keyword: search });
      } else {
        result = await this.get();
      }
      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
const SubdistrictService = new LocationService(subdistrictUrl);
const DistrictService = new LocationService(districtUrl);
const ProvinceService = new LocationService(provinceUrl);
export default { SubdistrictService, DistrictService, ProvinceService };
