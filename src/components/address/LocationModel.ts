import { flow, types } from "mobx-state-tree";
import { IInput } from "../../utils/common-interface";
import LocationService from "./LocationService";

export const ProvinceModel = types
	.model("ProvinceModel", {
		refCode: types.optional(types.string, ""),
		thName: types.optional(types.string, ""),
		enName: types.optional(types.string, ""),
	})
	.views((self: any) => ({
		get listitem() {
			return {
				key: self.refCode,
				value: self.refCode,
				text: self.thName,
			};
		},
	}));
export const DistrictModel = types
	.model("DistrictModel", {
		refCode: types.optional(types.string, ""),
		thName: types.optional(types.string, ""),
		enName: types.optional(types.string, ""),
		province: types.maybeNull(ProvinceModel),
	})
	.views((self: any) => ({
		get listitem() {
			return {
				key: self.refCode,
				value: self.refCode,
				text: self.thName,
				description: self.province ? `${self.province.thName}` : "",
			};
		},
	}));
export const SubdistrictModel = types
	.model("SubdistrictModel", {
		refCode: types.optional(types.string, ""),
		thName: types.optional(types.string, ""),
		enName: types.optional(types.string, ""),
		latitude: types.optional(types.string, ""),
		longtitude: types.optional(types.string, ""),
		zipcode: types.optional(types.string, ""),
		postcode: types.optional(types.string, ""),
		district: types.maybe(DistrictModel),
		province: types.maybe(ProvinceModel),
	})
	.views((self: any) => ({
		get listitem() {
			return {
				key: self.refCode,
				value: self.refCode,
				text: self.thName,
				description: self.district
					? `${self.district.thName} >> ${self.province.thName}`
					: "",
			};
		},
	}));

export const LocationModel = types
	.model("LocationModel", {
		subdistricts: types.array(SubdistrictModel),
		districts: types.array(DistrictModel),
		provinces: types.array(ProvinceModel),
	})
	.actions((self: any) => ({
		setField: ({ fieldname, value }: IInput) => {
			self[fieldname] = value;
		},
		loadSubdistrict: flow(function*(search?: string) {
			try {
				const data = yield search
					? LocationService.SubdistrictService.search(search)
					: LocationService.SubdistrictService.search();
				self.subdistricts = data;
			} catch (e) {
				console.log(e);
			}
		}),
		loadDistrict: flow(function*(search?: string) {
			try {
				const data = yield search
					? LocationService.DistrictService.search(search)
					: LocationService.DistrictService.search();
				self.districts = data;
			} catch (e) {
				console.log(e);
			}
		}),
		loadProvince: flow(function*(search?: string) {
			try {
				const data = yield search
					? LocationService.ProvinceService.search(search)
					: LocationService.ProvinceService.search();
				self.provinces = data;
			} catch (e) {
				console.log(e);
			}
		}),
	}));
export type ILocationModel = typeof LocationModel.Type;
export type ISubdistrictModel = typeof SubdistrictModel.Type;
export default LocationModel.create();
