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
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-slate-900 border border-slate-700 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Applicants</h2>

      {list.length === 0 && <p className="text-slate-400 text-sm">No applicants yet.</p>}

      {list.map((a) => (
        <div key={a._id} className="border border-slate-700 rounded-xl p-3 mb-3">
          <p className="font-semibold">{a.driver.name}</p>
          <p className="text-slate-400 text-xs">{a.driver.email}</p>
          <p className="text-slate-400 text-xs">{a.driver.phone}</p>
          <p className="text-slate-300 text-xs mt-1">Experience: {a.driver.experience} yrs</p>
          <p className="text-slate-300 text-xs">Vehicle: {a.driver.vehicleType}</p>
        </div>
      ))}
    </div>
  );
}
