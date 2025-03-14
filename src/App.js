import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

const websitesToCheck = [
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
    { name: "Holiday Sweet Memories", url: "https://holidaysweetmemories.com" }
];

function App() {
    const [statuses, setStatuses] = useState({});
    const [loading, setLoading] = useState(false);
    const API_URL = "https://web-checker-slsb.onrender.com/";

    const simulateContactUsTrial = async (siteUrl) => {
        try {
          // Attempt to access the "Contact Us" page (assumed to be at siteUrl/contact)
          const res = await axios.get(`${siteUrl}/contact`);
          return res.status === 200;
        } catch (error) {
          return false;
        }
      };
      
      const checkWebsites = async () => {
        setLoading(true);
        let newStatuses = {};
        for (let i = 0; i < websitesToCheck.length; i++) {
          const site = websitesToCheck[i];
          try {
            const response = await axios.get(
              `${API_URL}/check-site?url=${encodeURIComponent(site.url)}`
            );
      
            // If the site appears "Up"
            if (response.data.status === "Up") {
              // If there's an error indicating malware/blockage, perform an extra check
              if (
                response.data.error &&
                (response.data.error.toLowerCase().includes("bitdefender") ||
                 response.data.error.toLowerCase().includes("malware"))
              ) {
                const contactAccessible = await simulateContactUsTrial(site.url);
                if (contactAccessible) {
                  newStatuses[site.name] = {
                    status: "✅ Online (Contact accessible)",
                    code: response.data.code,
                  };
                } else {
                  newStatuses[site.name] = {
                    status: "❌ Blocked (Contact inaccessible)",
                    code: response.data.error || "No Response",
                  };
                }
              } else {
                newStatuses[site.name] = {
                  status: "✅ Online",
                  code: response.data.code,
                };
              }
            } else {
              newStatuses[site.name] = {
                status: "❌ Down",
                code: response.data.error || "No Response",
              };
            }
          } catch (error) {
            newStatuses[site.name] = {
              status: "⚠️ Error",
              code: error.message,
            };
          }
          // Update the statuses for each website iteration
          setStatuses((prevStatuses) => ({ ...prevStatuses, ...newStatuses }));
          // Slight delay between checks
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        setLoading(false);
      };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100" 
            style={{ backgroundColor: "#add8e6", padding: "20px", textAlign: "center" }}>
            
            <motion.h1 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1 }}
            >
                🌐 Website Status Checker
            </motion.h1>
            
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-3"
            >
                <Button onClick={checkWebsites} variant="primary" size="lg" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <strong style={{ fontSize: "1.6rem", marginLeft: "8px", color: "#004080" }}>Checking...</strong>
                        </>
                    ) : (
                        "🔄 Refresh Status"
                    )}
                </Button>
            </motion.div>

            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="d-flex flex-column align-items-center mt-3"
                >
                    <Spinner animation="border" variant="primary" role="status" style={{ width: "3rem", height: "3rem" }} />
                    <p className="mt-2" style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#004080" }}>Checking website statuses...</p>
                </motion.div>
            )}

            {!loading && (
                <div className="d-flex justify-content-center">
                    <Table 
                        striped 
                        bordered 
                        hover 
                        responsive 
                        className="shadow-lg" 
                        style={{ maxWidth: "80%", backgroundColor: "#ffffff", textAlign: "center", margin: "auto" }}
                    >
                        <thead>
                            <tr className="text-center">
                                <th className="text-center">Website</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Response Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(statuses).map(([site, info], index) => (
                                <motion.tr
                                    key={site}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.2 }}
                                    className="text-center"
                                >
                                    <td className="text-center">
                                        <a href={websitesToCheck.find(w => w.name === site)?.url} 
                                           target="_blank" 
                                           rel="noopener noreferrer">
                                            {site}
                                        </a>
                                    </td>
                                    <td className="text-center">{info.status}</td>
                                    <td className="text-center">{info.code}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
}

export default App;
