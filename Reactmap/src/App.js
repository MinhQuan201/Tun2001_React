import "./App.css";

import React, { useEffect, useState } from "react";

import Map from "./Map";
import { SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import Sidebar from "./sidebar";
import axios from "axios";
import useDebounce from "./hooks/useDebouce";

export const CollapseContext = React.createContext({
  value: undefined,
  setValue: () => undefined,
});
function App() {
  const key = "AIzaSyCkd4XdDoOlN_UkeU0VtDHIIon8enFrhck";

  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const debounce = useDebounce(search, 500);
  const [value, setValue] = useState(null);
  const [center, setCenter] = useState({
    lat: 21.056023177542567,
    lng: 105.82097280698585,
    isShowIcon: false,
  });
  const [clickScreen, setClickScreen] = useState({ lat: null, lng: null });
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json",
        {
          params: {
            query: debounce,
            key: key,
          },
        }
      );
      setOptions(res.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  // const getDataByLocation = async () => {
  //   try {
  //     const res = await axios.get(
  //       `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${clickScreen.lat},${clickScreen.lng}&radius=50&type=convenience_store&keyword=&key=${key}`,
  //       {
  //         params: {
  //           query: debounce,
  //           key: key,
  //         },
  //       }
  //     );
  //     setOptions(res.data.results);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const getDirections = async () => {
  //   try {
  //     const res = await axios.get(
  //       `https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=${key}`,
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
    if (debounce) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce]);

  useEffect(() => {}, [value]);

  // useEffect(() => {
  //   getDataByLocation();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [clickScreen.lat, clickScreen.lng]);
  return (
    <CollapseContext.Provider value={{ value, setValue }}>
      <div className="flex">
        <div className="w-[calc(100%-384px)] p-5 overflow-auto">
          <header>Cửa hàng tạp hóa quận Bắc Từ Liêm</header>
          <Select
            showSearch
            allowClear
            filterOption={false}
            suffixIcon={<SearchOutlined />}
            onSearch={(value) => {
              setSearch(value);
            }}
            onSelect={(value) => {
              setValue(null);
              setCenter({
                lat: Number(value.split("_")[0]),
                lng: Number(value.split("_")[1]),
                isShowIcon: true,
              });
            }}
            className="w-60 mb-4"
            options={options.map((e) => ({
              value: `${e?.geometry?.location.lat}_${e?.geometry?.location.lng}`,
              label: `${e?.name}, ${e?.formatted_address}`,
            }))}
          />
          <Map
            setCenter={setCenter}
            setClickScreen={setClickScreen}
            clickScreen={clickScreen}
            center={center}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={
              <div
                style={{
                  height: `calc(100% - 80px)`,
                  margin: `auto`,
                  border: "2px solid black",
                }}
              />
            }
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
        <Sidebar />
      </div>
    </CollapseContext.Provider>
  );
}

export default App;
