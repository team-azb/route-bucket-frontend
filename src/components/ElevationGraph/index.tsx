import { useMemo } from "react";
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
import { Segment, FocusedMarkerInfo } from "../../types";

type ElevationGraphProp = {
  FocusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  segments: Segment[];
};

type ElevationGraphTooltipContentProps = TooltipProps<number, string> & {
  FocusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
};

function meters2kilometers(meters: number) {
  return meters / 1000;
}

function formatElevation(elevation: number) {
  return `${elevation}m`;
}

function formatDistance(value: number) {
  return `${meters2kilometers(value).toFixed(2)}km`;
}

function ElevationGraphTooltipContent(
  props: ElevationGraphTooltipContentProps
) {
  if (props.active && props.payload) {
    if (
      props.payload &&
      (props.FocusedMarkerInfo?.position?.lat !==
        props.payload[0].payload.latitude ||
        props.FocusedMarkerInfo?.position?.lng !==
          props.payload[0].payload.longitude)
    ) {
      const data = props.payload[0].payload;
      props.setFocusedMarkerInfo((prevState) => {
        return {
          ...prevState,
          idx: data.idx,
          position: new L.LatLng(data.latitude, data.longitude),
        };
      });
    }
    return (
      <div className="ElevationGraph-tooltip">
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

export default function ElevationGraph(props: ElevationGraphProp) {
  const coords = useMemo<any[]>(() => {
    return props.segments
      .map((segment, idx) => {
        return segment.points.map((pos) => {
          return { ...pos, idx: idx };
        });
      })
      .flat();
  }, [props.segments]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={coords}
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
              <ElevationGraphTooltipContent
                FocusedMarkerInfo={props.FocusedMarkerInfo}
                setFocusedMarkerInfo={props.setFocusedMarkerInfo}
              />
            }
          />
          <Legend />
          <Line
            dot={false}
            type="monotone"
            dataKey="elevation"
            stroke="#8884d8"
            // activeDot={<ElevationGraphDot/>}
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
