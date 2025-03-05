import React, { useEffect, useState } from "react";
import axios from "axios";
import { sendEmail } from "./utils/emailUtils";

const websitesToCheck = [
    // All websites provided in images and messages
    { name: "Car Albania", url: "https://caralbania.com" },
    { name: "Villa Sunmare", url: "https://villasunmare.com" },
    { name: "GS Tourist Centre", url: "https://gstouristcentre.gr" },
    { name: "Angel Transfers Corfu", url: "https://angeltransferscorfu.com" },
    { name: "Nivo Soap", url: "https://nivosoap.com" },
    { name: "Gozaxos", url: "https://gozaxos.gr" },
    { name: "Serena", url: "https://serena.gr" },
    { name: "Sckosmos", url: "https://sckosmos.com" },
    { name: "Captain Homers Boat Trips", url: "https://captainhomersboattrips.com" },
    { name: "Corfu Tasia Studios", url: "https://corfu-tasia-studios.gr" },
    { name: "Corfu Balis", url: "https://corfu-balis.gr" },
    { name: "Lina Studios", url: "https://linastudios.com" },
    { name: "Anthis Constructions", url: "https://anthisconstructions.com" },
    { name: "Group Energy", url: "https://groupenergy.gr" },
    { name: "Melife Fitness", url: "https://melife.fitness" },
    { name: "Tzevenos", url: "https://tzevenos.gr" },
    { name: "Corfu Malibu", url: "https://corfu-malibu.gr" },
    { name: "Corfu Hotel Margarita", url: "https://corfu-hotel-margarita.com" },
    { name: "Ntsanos", url: "https://ntsanos.com" },
    { name: "South Corfu Runners", url: "https://southcorfurunners.com" },
    { name: "Corfu Stars", url: "https://corfustars.gr" },
    { name: "Privilege Speed Boats", url: "https://privilegespeedboats.com" },
    { name: "Luxury Villa Diamond Corfu", url: "https://luxuryvilladiamondcorfu.com" },
    { name: "Villa Ramos", url: "https://villa-ramos.com" },
    { name: "Express Service Corfu", url: "https://expressservicecorfu.gr" },
    { name: "Stefanos Resort", url: "https://stefanosresort.com" },
    { name: "Corfu 3 Stars Villas", url: "https://corfu3starsvillas.com" },
    { name: "75 Steps", url: "https://75steps.com" },
    { name: "OS Creations", url: "https://oscreations.art" },
    { name: "Marina Hotel Corfu", url: "https://marinahotelcorfu.com" },
    { name: "Ionian EMS", url: "https://ionianems.com" },
    { name: "Miami Sea View", url: "https://miamiseaview.gr" },
    { name: "Corfu Delicatessen", url: "https://corfudelicatessen.com" },
    { name: "Autoplan Corfu", url: "https://autoplancorfu.gr" },
    { name: "Golden Home Corfu", url: "https://goldenhomecorfu.com" },
    { name: "Holiday Sweet Memories", url: "https://holidaysweetmemories.com" },
    { name: "GT Systems", url: "https://gtsystems.gr" },
    { name: "WiFi Hotspot", url: "https://wifihotspot.gr" },
    { name: "Villa Panorea", url: "https://villapanorea.com" },
    { name: "Corfu South", url: "https://corfu-south.gr" },
    { name: "Corfu VIP", url: "https://corfuvip.gr" },
    { name: "GT Systems EU", url: "https://gtsystems.eu" },
    { name: "Holiday Sweet Memories GR", url: "https://holidaysweetmemories.gr" }
];

function App() {
    const [statuses, setStatuses] = useState({});

    const API_URL = "https://web-checker-slsb.onrender.com"; // Replace with your actual backend URL

    const checkWebsites = async () => {
      let newStatuses = {};

      for (let site of websitesToCheck) {
          try {
            const response = await axios.get(`${API_URL}/check-site?url=${encodeURIComponent(site.url)}`);

              if (response.data.status === "Up") {
                  newStatuses[site.name] = { status: "Up", code: response.data.code };
              } else {
                  newStatuses[site.name] = { status: "Down or Blocked", code: response.data.error || "No Response" };
              }
          } catch (error) {
              newStatuses[site.name] = { status: "Error", code: error.message };
          }
      }

      setStatuses(newStatuses);
  };

  useEffect(() => {
      checkWebsites();
  }, []);

  return (
      <div style={{ textAlign: "center", padding: "20px" }}>
          <h1>Website Status Checker</h1>
          <ul>
              {Object.entries(statuses).map(([site, info]) => (
                  <li key={site}>
                      <strong>{site}:</strong> {info.status} (Code: {info.code})
                  </li>
              ))}
          </ul>
          <button onClick={checkWebsites}>Check Now</button>
      </div>
  );
}

export default App;
