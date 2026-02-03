import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Applicants() {
  const { jobId } = useParams();
  const [list, setList] = useState([]);

  useEffect(() => {
    API.get(`/applications/${jobId}`)
      .then((res) => setList(res.data))
      .catch(() => alert("Failed to load applicants"));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white border border-gray-300 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Applicants</h2>

      {list.length === 0 && <p className="text-gray-600 text-sm">No applicants yet.</p>}

      {list.map((a) => (
        <div key={a._id} className="border border-gray-300 rounded-xl p-3 mb-3 bg-white">
          <p className="font-semibold">{a.driver.name}</p>
          <p className="text-gray-600 text-xs">{a.driver.email}</p>
          <p className="text-gray-600 text-xs">{a.driver.phone}</p>
          <p className="text-gray-600 text-xs mt-1">Experience: {a.driver.experience} yrs</p>
          <p className="text-gray-600 text-xs">Vehicle: {a.driver.vehicleType}</p>
        </div>
      ))}
    </div>
  );
}
