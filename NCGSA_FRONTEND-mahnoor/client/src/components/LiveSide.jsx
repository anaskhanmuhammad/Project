import React, { useEffect, useState } from "react";

const LiveSide = ({ data }) => {
    let lastData = [];
    if (data.length > 0) {
        lastData = data[data.length - 1];
    }

    const [portName, setPortName] = useState("Loading..."); // State to hold port name
    const [aveData, setAveData] = useState(null);

    // Fetch the port name from the backend
    useEffect(() => {
        const fetchPortName = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/getPortName"
                );
                const result = await response.json();
                setPortName(result.portName); // Set the port name in state
            } catch (error) {
                console.error("Error fetching port name:", error);
                setPortName("Error fetching port");
            }
        };

        fetchPortName();
    }, []);

    return (
        <div className="w-1/4">
            <div>
                <fieldset className="border border-slate-600 p-5 m-2">
                    <legend>Parameters Setting</legend>
                    <div className="mb-3">
                        <div>
                            <label htmlFor="port" className="font-bold">
                                Serial port selected
                            </label>
                        </div>
                        <input
                            type="text"
                            name="port"
                            id="port"
                            value={portName} // Dynamically display port name
                            className="w-32 border border-slate-600 rounded-sm"
                            readOnly
                        />
                    </div>
                </fieldset>
                <fieldset className="border border-slate-600 p-5 m-2">
                    <legend>Magnetic Field Value</legend>
                    <div className="mb-4">
                        <label htmlFor="xValue" className="font-bold">
                            X-axis:
                        </label>
                        <input
                            type="text"
                            name="xValue"
                            id="xValue"
                            value={lastData.x}
                            className="border border-slate-500 rounded-sm mx-5"
                        />
                        <span>nT</span>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="yValue" className="font-bold">
                            Y-axis:
                        </label>
                        <input
                            type="text"
                            name="yValue"
                            id="yValue"
                            value={lastData.y}
                            className="border border-slate-500 rounded-sm mx-5"
                        />
                        <span>nT</span>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="zValue" className="font-bold">
                            Z-axis:
                        </label>
                        <input
                            type="text"
                            name="zValue"
                            id="zValue"
                            value={lastData.z}
                            className="border border-slate-500 rounded-sm mx-5"
                        />
                        <span>nT</span>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="total" className="font-bold">
                            Total
                        </label>
                        <input
                            type="text"
                            name="total"
                            id="total"
                            value={lastData.total}
                            className="border border-slate-500 rounded-sm mx-5"
                        />
                        <span>nT</span>
                    </div>
                </fieldset>
            </div>
        </div>
    );
};

export default LiveSide;
