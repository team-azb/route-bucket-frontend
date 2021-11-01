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
import { meters2kilometers } from "../../utils";
import { Segment, FocusedMarkerInfo } from "../../types";

type ElevationGraphProp = {
  focusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
  segments: Segment[];
};

type ElevationGraphTooltipContentProps = TooltipProps<number, string> & {
  FocusedMarkerInfo: FocusedMarkerInfo;
  setFocusedMarkerInfo: React.Dispatch<React.SetStateAction<FocusedMarkerInfo>>;
};

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
      (props.FocusedMarkerInfo.position.lat !==
        props.payload[0].payload.latitude ||
        props.FocusedMarkerInfo.position.lng !==
          props.payload[0].payload.longitude)
    ) {
      const data = props.payload[0].payload;
      props.setFocusedMarkerInfo((prevState) => {
        return {
          ...prevState,
          idx: data.idx,
          position: new L.LatLng(data.latitude, data.longitude),
          isDisplayed: true,
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

  return <></>;
}

function segments2data(segments: Segment[]) {
  return segments
    .map((segment, idx) => {
      return segment.points.map((pos) => {
        return { ...pos, idx: idx };
      });
    })
    .flat()
    .filter((pos) => pos.elevation);
}

export default function ElevationGraph(props: ElevationGraphProp) {
  /**
   * rechartsにdataとして渡す配列
   */
  const pointsData = useMemo<any[]>(() => {
    return segments2data(props.segments);
  }, [props.segments]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={pointsData}
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
            width={40}
            type="number"
            dataKey="elevation"
            tickFormatter={formatElevation}
          />
          <Tooltip
            active={false}
            content={
              <ElevationGraphTooltipContent
                FocusedMarkerInfo={props.focusedMarkerInfo}
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
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
