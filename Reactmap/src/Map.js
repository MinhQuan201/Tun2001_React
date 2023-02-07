import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import React, { useEffect, useState } from "react";

import { CollapseContext } from "./App";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import { LIST_STORE } from "./constants/constants";
import location from "./assets/location1.png";
import { useContext } from "react";

const options = { closeBoxURL: "", enableEventPropagation: true };
const Map = ({ center, setClickScreen, setCenter, clickScreen }) => {
  const { value } = useContext(CollapseContext);
  const [listPlace, setListPlace] = useState([]);
  const [listStore, setListStore] = useState(LIST_STORE);
  const [zoom, setZoom] = useState(15);

  const [idOpen, setIdOpen] = useState(null);

  useEffect(() => {
    if (value === 0) {
      setListPlace(listStore);
    } else {
      setListPlace(
        listStore
          .filter((e) => e.ward === value)
          .concat(
            listStore
              .filter((f) => f.ward !== value)
              .map((e) => ({
                ...e,
                lat: 0,
                lng: 0,
              }))
          )
      );
    }
    setTimeout(() => {
      setCenter({
        lat: 21.070741728064068, 
        lng: 105.78045347696576
      });
    }, 10);
    setZoom(14);
  }, [value, listStore, setCenter]);

  const defaultCenter = {
    lat: 21.06218119099429,
    lng: 105.75591810216302
  }
  return (
    <div>
      <GoogleMap
        defaultZoom={15}
        zoom={zoom}
        defaultCenter={defaultCenter}
        center={center}
        onClick={(e) => {
          setClickScreen({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }}
      >
        {center.lat && center.isShowIcon && (
          <Marker
            onClick={(e) =>
              setClickScreen({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
            icon={{
              url: location,
              scaledSize: new window.google.maps.Size(35, 35),
            }}
            position={{ lat: center.lat, lng: center.lng }}
          ></Marker>
        )}
        {listPlace?.map((item) => (
          <div>
            <Marker
              onClick={(e) => {
                setClickScreen({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                setIdOpen(item.id);
              }}
              icon={{
                url: location,
                scaledSize:
                  item.lat === 0
                    ? new window.google.maps.Size(0, 0)
                    : new window.google.maps.Size(35, 35),
              }}
              position={{ lat: item.lat, lng: item.lng }}
            >
              <InfoBox options={options}>
                <div
                  style={{
                    backgroundColor: "#FF69B4",
                    color: "white",
                    borderRadius: "1em",
                    padding: "0.2em",
                  }}
                >
                  {item.name}
                </div>
              </InfoBox>
            </Marker>
          </div>
        ))}
      </GoogleMap>
    </div>
  );
};

export default withScriptjs(withGoogleMap(Map));
