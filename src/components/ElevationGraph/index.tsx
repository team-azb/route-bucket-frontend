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
import { Segment, TempMarkerInfo } from "../../types";

type ElevationGraphProp = {
  tempMarkerInfo: TempMarkerInfo;
  setTempMarkerInfo: React.Dispatch<React.SetStateAction<TempMarkerInfo>>;
  segments: Segment[];
};

type CustomTooltipProps = TooltipProps<number, string> & {
  tempMarkerInfo: TempMarkerInfo;
  setTempMarkerInfo: React.Dispatch<React.SetStateAction<TempMarkerInfo>>;
};

export default function ElevationGraph(props: ElevationGraphProp) {
  const data = props.segments
    .map((segment, idx) => {
      return segment.points.map((pos) => {
        return { ...pos, idx: idx };
      });
    })
    .flat();

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
        props.tempMarkerInfo?.position?.lat !==
          props.payload[0].payload.latitude
      ) {
        props.setTempMarkerInfo({
          ...props.tempMarkerInfo,
          index: props.payload[0].payload.idx,
          position: new L.LatLng(
            props.payload[0].payload.latitude,
            props.payload[0].payload.longitude
          ),
        });
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
                tempMarkerInfo={props.tempMarkerInfo}
                setTempMarkerInfo={props.setTempMarkerInfo}
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
