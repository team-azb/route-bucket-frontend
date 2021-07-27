import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import L from "leaflet";
import { Segment } from "../../types";

type ElevationGraphProp = {
  tempMarkerPosition: L.LatLng | null;
  setTempMarkerPosition: React.Dispatch<React.SetStateAction<L.LatLng | null>>;
  segments: Segment[];
};

type CustomTooltipProps = TooltipProps<number, string> & {
  tempMarkerPosition: L.LatLng | null;
  setTempMarkerPosition: React.Dispatch<React.SetStateAction<L.LatLng | null>>;
};

export default function ElevationGraph(props: ElevationGraphProp) {
  const data = props.segments.map((segment) => segment.points).flat();

  function onMouseOverHandler(_data: any, elem: any) {
    props.setTempMarkerPosition(
      new L.LatLng(elem.payload.latitude, elem.payload.longitude)
    );
  }

  function onMouseLeaveHandler() {
    props.setTempMarkerPosition(null);
  }

  function formatElevation(elevation: number) {
    return `${elevation}m`;
  }

  function formatDistance(value: number) {
    return `${String(Math.round((value / 1000) * 10) / 10)}km`;
  }

  function CustomTooltip(props: CustomTooltipProps) {
    if (props.active && props.payload) {
      if (
        props.payload[0] &&
        props.tempMarkerPosition?.lat !== props.payload[0].payload.latitude
      ) {
        props.setTempMarkerPosition(
          new L.LatLng(
            props.payload[0].payload.latitude,
            props.payload[0].payload.longitude
          )
        );
      }
      return (
        <div className="custom-tooltip">
          <p className="label">distance: {`${formatDistance(props.label)}`}</p>
          <p className="desc">
            elevation:{" "}
            {`${
              props.payload[0].value && formatElevation(props.payload[0].value)
            }`}
          </p>
        </div>
      );
    }

    return null;
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
            tickFormatter={formatDistance}
          />
          <YAxis
            type="number"
            dataKey="elevation"
            tickFormatter={formatElevation}
          />
          <Tooltip
            active={false}
            content={
              <CustomTooltip
                tempMarkerPosition={props.tempMarkerPosition}
                setTempMarkerPosition={props.setTempMarkerPosition}
              />
            }
          />
          <Legend />
          <Line
            dot={false}
            type="monotone"
            dataKey="elevation"
            stroke="#8884d8"
            // activeDot={<CustomDot/>}
            activeDot={{
              r: 8,
              onMouseOver: onMouseOverHandler,
              onMouseLeave: onMouseLeaveHandler,
              onChangeCapture: (event) => {
                console.log(event);
              },
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
