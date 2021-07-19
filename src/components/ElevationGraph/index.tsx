import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import L from "leaflet";
import { Segment } from "../../types";

type ElevationGraphProp = {
  setTempMarkerPosition: React.Dispatch<React.SetStateAction<L.LatLng | null>>;
  segments: Segment[];
};

export default function ElevationGraph(props: ElevationGraphProp) {
  // const [tempMarkerPosition, setTempMarkerPosition] = useState<L.LatLng | null>(null);
  const data = props.segments.map((segment) => segment.points).flat();

  function onMouseOverHandler(_data: any, elem: any) {
    props.setTempMarkerPosition(
      new L.LatLng(elem.payload.latitude, elem.payload.longitude)
    );
  }

  function onMouseLeaveHandler() {
    props.setTempMarkerPosition(null);
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, "dataMax"]}
            dataKey="distance_from_start"
          />
          <YAxis type="number" dataKey="elevation" />
          <Tooltip 
            active={false}
            // cursor={false}
          />
          <Legend />
          <Line
            dot={false}
            type="monotone"
            dataKey="elevation"
            stroke="#8884d8"
            activeDot={{
              r: 8,
              onMouseOver: onMouseOverHandler,
              onMouseLeave: onMouseLeaveHandler,
              onChangeCapture: (event) => {console.log(event);
              }
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
