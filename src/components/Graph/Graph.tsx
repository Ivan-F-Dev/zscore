// Можно отрефакторить до более аккуратного и читабельного состояния, но в целом задача тестового уже выполняется.
// Точки где z-score > 1 покрашены в красный. Чтоб приемлемо покрасить столбцы нужно больше точек, а при  текущем их количестве это не будет наглядно.


import {type FC} from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceArea
} from 'recharts';
// import s from "./Graph.module.scss"
type GraphProps = {
    someProps: number
};

const data = [
    {
        x: 0,
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        x: 100,
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        x: 200,
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        x: 300,
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        x: 400,
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        x: 500,
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        x: 600,
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const CustomDot = (props: { cx?: number, cy?: number, dataKey? : string, payload?: {highlightUv : boolean, highlightPv : boolean} }) => {
    const { cx, cy,dataKey, payload } = props;
    const color = dataKey === 'uv' ? '#82ca9d' : '#8884d8'
    const highlight = dataKey === 'uv' ? payload?.highlightUv : payload?.highlightPv;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            fill={highlight ? 'red' : color}
            stroke="#fff"
            strokeWidth={1}
        />
    );
};

export const Graph:FC<GraphProps> = () => {

    // Стандартизируем uv
    const uvValues = data.map(d => d.uv);
    const meanUv = uvValues.reduce((a, b) => a + b, 0) / uvValues.length;
    const stdUv = Math.sqrt(uvValues.reduce((sum, val) => sum + (val - meanUv) ** 2, 0) / uvValues.length);
    // Стандартизируем pv
    const pvValues = data.map(d => d.pv);
    const meanPv = pvValues.reduce((a, b) => a + b, 0) / pvValues.length;
    const stdPv = Math.sqrt(pvValues.reduce((sum, val) => sum + (val - meanPv) ** 2, 0) / pvValues.length);

    const normalizedData = data.map(d => ({
        ...d,
        highlightUv: (d.uv - meanUv) / stdUv > 1,
        highlightPv: (d.pv - meanPv) / stdPv > 1,
        text: `uv (d.uv - meanUv) / stdUv = ${(d.uv - meanUv) / stdUv}; (d.pv - meanPv) / stdPv = ${(d.pv - meanPv) / stdPv}`
    }));
    console.log("normalizedData",normalizedData)
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={normalizedData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                {normalizedData.map((d, i, array) => {
                    if (d?.highlightUv || d?.highlightPv) {
                        console.log(d)
                        return (
                            <ReferenceArea
                                key={`highlight-col-${i}`}
                                x1={i === 0 ? d.x : d.x - 100}
                                x2={i === array.length-1 ? d.x : d.x + 100}
                                y1={0}
                                y2={10000}
                                fill={d?.highlightUv ? "#82ca9d" : "#8884d8"}
                                fillOpacity={0.55}
                                ifOverflow="extendDomain"
                            />
                        );
                    }
                    return null;
                })}
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" dot={<CustomDot />}/>
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" dot={<CustomDot />}/>
            </LineChart>
        </ResponsiveContainer>
    );
};