/* global google */
import _ from "lodash";
import { observer } from "mobx-react";
import * as React from "react";
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import { withTranslation, WithTranslation } from "react-i18next";
import { Icon, List, Message, Segment } from "semantic-ui-react";
import { IAddressModel } from "../../address";
declare const google: any;

interface IDefaultCenter {
  lat: number;
  lng: number;
}

const DEFAULT_LAT = 13.769239;
const DEFAULT_LONG = 100.538408;

const MapWithAMarker = withGoogleMap<{
  defaultCenter: IDefaultCenter;
  lat: number;
  lng: number;
  onClick: (e: any) => void;
  onSearchBoxMounted: any;
  bounds: any;
  onPlacesChanged: any;
  mode?: "editMode" | "createMode";
}>((props) => (
  <GoogleMap
    defaultZoom={18}
    defaultCenter={props.defaultCenter}
    onClick={props.onClick}
    center={{
      lat: props.lat || DEFAULT_LAT,
      lng: props.lng || DEFAULT_LONG
    }}
  >
    {props.mode ? (
      <SearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder="ค้นหาที่อยู่"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `39.5px`,
            marginTop: `10px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`
          }}
        />
      </SearchBox>
    ) : null}

    <Marker position={{ lat: props.lat, lng: props.lng }} />
  </GoogleMap>
));

interface IMapMarker extends WithTranslation {
  addressStore: IAddressModel;
  mode?: "editMode" | "createMode";
}
@observer
class MapMarker extends React.Component<IMapMarker> {
  public componentDidMount() {
    if (this.props.mode === "createMode") {
      this.showCurrentLocation();
    }
  }
  public state = {
    bounds: null,
    center: {
      lat: 13.769239,
      lng: 100.538408
    },
    markers: [],
    onMapMounted: null,
    onBoundsChanged: null,
    onSearchBoxMounted: null,
    onPlacesChanged: null
  };
  public componentWillMount() {
    const refs: any = {};
    this.setState({
      bounds: null,
      center: {
        lat: 13.769239,
        lng: 100.538408
      },
      markers: [],
      onMapMounted: (ref: any) => {
        refs.map = ref;
      },
      onBoundsChanged: () => {
        this.setState({
          bounds: refs.map.getBounds(),
          center: refs.map.getCenter()
        });
      },
      onSearchBoxMounted: (ref: any) => {
        refs.searchBox = ref;
      },
      onPlacesChanged: () => {
        const places = refs.searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place: any) => {
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        const nextMarkers = places.map((place: any) => ({
          position: place.geometry.location
        }));
        const nextCenter = _.get(nextMarkers, "0.position", this.state.center);
        if (nextCenter.lat() && nextCenter.lng()) {
          this.setState({
            center: nextCenter,
            markers: nextMarkers
          });
          this.props.addressStore.setField({
            fieldname: "latitude",
            value: `${nextCenter.lat()}`
          });
          this.props.addressStore.setField({
            fieldname: "longitude",
            value: `${nextCenter.lng()}`
          });
        }
      }
    });
  }

  public showCurrentLocation = () => {
    if (navigator.geolocation && this.props.mode) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.props.addressStore.setField({
          fieldname: "latitude",
          value: position.coords.latitude.toString()
        });
        this.props.addressStore.setField({
          fieldname: "longitude",
          value: position.coords.longitude.toString()
        });
      });
    }
  };

  public render() {
    const googleOb = (window as any).google;
    return (
      <Segment padded>
        <Segment>
          <List horizontal>
            <List.Item>
              <Icon
                name="map marker alternate"
                color="red"
                circular
                link={this.props.mode ? true : false}
                inverted
                onClick={this.showCurrentLocation}
              />
            </List.Item>
            <List.Item
              style={{ verticalAlign: "middle" }}
            >{`ละติจูด: ${this.props.addressStore.latitude}`}</List.Item>
            <List.Item
              style={{ verticalAlign: "middle" }}
            >{`ลองจิจูด: ${this.props.addressStore.longitude}`}</List.Item>
          </List>
        </Segment>
        {googleOb ? this.renderMapWithAMarker() : this.renderErrorMap()}
      </Segment>
    );
  }

  private renderMapWithAMarker() {
    try {
      return (
        <MapWithAMarker
          mode={this.props.mode}
          onSearchBoxMounted={this.state.onSearchBoxMounted}
          bounds={this.state.bounds}
          onPlacesChanged={this.state.onPlacesChanged}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          defaultCenter={{
            lat: DEFAULT_LAT,
            lng: DEFAULT_LONG
          }}
          lat={parseFloat(this.props.addressStore.latitude)}
          lng={parseFloat(this.props.addressStore.longitude)}
          onClick={(x) => {
            const lat = x.latLng.lat();
            const lng = x.latLng.lng();
            if (this.props.mode) {
              this.props.addressStore.setField({
                fieldname: "latitude",
                value: lat.toString()
              });
              this.props.addressStore.setField({
                fieldname: "longitude",
                value: lng.toString()
              });
            }
          }}
        />
      );
    } catch (error) {
      console.log("map-with-marker :", error);
      return this.renderErrorMap();
    }
  }
  private renderErrorMap() {
    const { t } = this.props;
    return (
      <Message icon>
        <Icon name="exclamation circle" />
        <Message.Content>
          <Message.Header>
            {t("component.mapMarker.messageHeader")}
          </Message.Header>
          {t("component.mapMarker.messageContent")}
        </Message.Content>
      </Message>
    );
  }
}

export default withTranslation()(MapMarker);
