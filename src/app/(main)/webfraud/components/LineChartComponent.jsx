// // import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, } from "recharts";

// // export function LineChartComponent({ 
// //   data, 
// //   config, 
// //   xAxisTitle = "X-Axis", 
// //   yAxisTitle = "Y-Axis", 
// //   hoverEnabled = true 
// // }) {
// //   return (
// //     <ResponsiveContainer width="100%" height="100%">
// //       <LineChart
// //         data={data}
// //         margin={{
// //           top: 20,
// //           right: 30,
// //           left: 20,
// //           bottom: 10,
// //         }}
// //       >
// //         <CartesianGrid strokeDasharray="3 3" />
// //         <XAxis 
// //           dataKey="month" 
// //           label={{ value: xAxisTitle, position: "insideBottom", offset: -10 }} 
// //         />
// //         <YAxis 
// //           label={{ value: yAxisTitle, angle: -90, position: "insideLeft" }} 
// //           domain={[0, 'dataMax + 10']} 
// //         />
// //         {hoverEnabled && <Tooltip />}
// //         <Legend />
// //         {Object.entries(config).map(([key, cfg]) => (
// //           <Line
// //             key={key}
// //             type="monotone"
// //             dataKey={key}
// //             stroke={cfg.color}
// //             strokeWidth={2}
// //             dot={{ r: 5 }}
// //             activeDot={{ r: 8 }}
// //           />
// //         ))}
// //       </LineChart>
// //     </ResponsiveContainer>
// //   );
// // }
// import {
//     CartesianGrid,
//     Line,
//     LineChart,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//   } from "recharts";
  
//   export const LineChartComponent = ({
//     data,
//     config,
//     xAxisTitle,
//     yAxisTitle,
//     hoverEnabled,
//   }) => {
//     // Inline custom square legend
//     const CustomSquareLegend = ({ payload }) => {
//       return (
//         <div className="flex flex-wrap gap-4 mt-4">
//           {payload.map((entry, index) => (
//             <div key={`legend-${index}`} className="flex items-center gap-2">
//               {/* Square marker */}
//               <div
//                 style={{
//                   width: 16,
//                   height: 16,
//                   backgroundColor: entry.color,
//                   borderRadius: 2, // Slight rounding for clean aesthetics
//                 }}
//               ></div>
//               {/* Legend text */}
//               <span className="text-sm">{entry.value}</span>
//             </div>
//           ))}
//         </div>
//       );
//     };
  
//     return (
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={data}
//           margin={{
//             top: 10,
//             // right: 30,
//             // left: 20,
//             bottom: 10,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis
//             dataKey="month"
//             label={{ value: xAxisTitle, position: "insideBottom", offset: -10 }}
//           />
//           <YAxis
//             label={{ value: yAxisTitle, angle: -90, position: "insideLeft" }}
//             domain={[0, "dataMax + 10"]}
//           />
//           {hoverEnabled && <Tooltip />}
//           <Legend content={<CustomSquareLegend />} />
//           {Object.entries(config).map(([key, value]) => (
//             <Line
//               key={key}
//               type="monotone"
//               dataKey={key}
//               stroke={value.color}
//               strokeWidth={2}
//               dot={{ r: 5 }}
//               activeDot={{ r: 8 }}
//             />
//           ))}
//         </LineChart>
//       </ResponsiveContainer>
//     );
//   };
import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  export const LineChartComponent = ({
    data,
    config,
    xAxisTitle,
    yAxisTitle,
    hoverEnabled,
  }) => {
    // Inline custom square legend
    const CustomSquareLegend = ({ payload }) => (
      <div className="flex flex-wrap gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: entry.color,
                borderRadius: 2,
              }}
            ></div>
            <span className="text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  
    const chartWidth = data.length * 70; // Dynamic width based on data
  
    return (
      <div style={{ minWidth: `${chartWidth}px`, height: "100%" }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{ value: xAxisTitle, position: "insideBottom", offset: -10 }}
              interval={0} 
              tickSize={2} 
            />
            <YAxis
              label={{ value: yAxisTitle, angle: -90, position: "insideLeft" }}
              domain={[0, "dataMax + 10"]}
            />
            {hoverEnabled && <Tooltip />}
            <Legend content={<CustomSquareLegend />} />
            {Object.entries(config).map(([key, value]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={value.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  