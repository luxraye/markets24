"use client";

import { createChart, ColorType, IChartApi, AreaSeries } from "lightweight-charts"; // <--- Added AreaSeries import
import React, { useEffect, useRef } from "react";

export const MarketChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize the Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f3fa" },
        horzLines: { color: "#f0f3fa" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
    });

    chartRef.current = chart;

    // 2. Add an Area Series (UPDATED FOR V5 API)
    const newSeries = chart.addSeries(AreaSeries, { // <--- FIXED HERE
      lineColor: "#2563eb", 
      topColor: "#2563eb",
      bottomColor: "rgba(37, 99, 235, 0.04)",
      lineWidth: 2,
    });

    // 3. Generate Realistic "Mock" Data (DCI Index style)
    const data = [];
    let price = 8900;
    const date = new Date();
    date.setMonth(date.getMonth() - 12); // Start 1 year ago

    for (let i = 0; i < 365; i++) {
      // Random walk: move up or down slightly
      const move = (Math.random() - 0.45) * 15; 
      price += move;
      
      // Format date as YYYY-MM-DD
      const dateStr = date.toISOString().split("T")[0];
      
      data.push({ time: dateStr, value: price });
      date.setDate(date.getDate() + 1);
    }

    newSeries.setData(data);
    chart.timeScale().fitContent();

    // 4. Handle Resizing
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-[300px]" />;
};