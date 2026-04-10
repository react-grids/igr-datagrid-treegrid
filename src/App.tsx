import { useMemo, useState } from 'react';
import {
  IgrGrid,
  IgrTreeGrid,
  IgrColumn,
} from 'igniteui-react-grids';
import { IgrTileManager, IgrTile } from 'igniteui-react';
import 'igniteui-webcomponents/themes/dark/material.css';
import 'igniteui-webcomponents-grids/grids/themes/dark/material.css';
import './App.css';

// ---------- Portfolio (hierarchical) ----------
type Position = {
  name: string;
  symbol?: string;
  marketValue: number;
  pnl: number;
  weight: number;
  change: number; // % day change
  price?: number;
  shares?: number;
  avgCost?: number;
  ytd?: number;       // YTD return %
  target?: number;    // target allocation %
  rating?: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'NR';
  region?: string;
  children?: Position[];
};

const portfolio: Position[] = [
  {
    name: 'Equities', marketValue: 2_400_000, pnl: 76_800, weight: 48, change: 3.3, ytd: 18.4, target: 50, region: 'Global',
    children: [
      {
        name: 'Technology', marketValue: 1_100_000, pnl: 52_800, weight: 22, change: 5.0, ytd: 32.1, target: 22, region: 'US',
        children: [
          { name: 'Apple Inc.',  symbol: 'AAPL', marketValue: 420_000, pnl: 8_820,  weight: 8.4, change: 2.1, price: 189.23, shares: 2_220, avgCost: 165.40, ytd: 18.2, target: 8,   rating: 'AA',  region: 'US' },
          { name: 'Microsoft',   symbol: 'MSFT', marketValue: 380_000, pnl: 21_280, weight: 7.6, change: 5.9, price: 412.55, shares:   921, avgCost: 298.10, ytd: 42.7, target: 8,   rating: 'AAA', region: 'US' },
          { name: 'NVIDIA',      symbol: 'NVDA', marketValue: 300_000, pnl: 22_700, weight: 6.0, change: 8.2, price: 878.19, shares:   342, avgCost: 412.00, ytd: 97.3, target: 5,   rating: 'A',   region: 'US' },
        ],
      },
      {
        name: 'Financials', marketValue: 800_000, pnl: 9_600, weight: 16, change: 1.2, ytd: 11.5, target: 16, region: 'US',
        children: [
          { name: 'JPMorgan Chase', symbol: 'JPM', marketValue: 450_000, pnl: 5_400, weight: 9.0, change: 1.2, price: 198.42, shares: 2_267, avgCost: 162.80, ytd: 14.1, target: 9, rating: 'A',   region: 'US' },
          { name: 'Goldman Sachs',  symbol: 'GS',  marketValue: 350_000, pnl: 4_200, weight: 7.0, change: 1.2, price: 442.18, shares:   791, avgCost: 358.40, ytd:  9.6, target: 7, rating: 'BBB', region: 'US' },
        ],
      },
      {
        name: 'Healthcare', marketValue: 500_000, pnl: 14_400, weight: 10, change: 2.9, ytd: 8.2, target: 12, region: 'US',
        children: [
          { name: 'UnitedHealth', symbol: 'UNH', marketValue: 280_000, pnl: 8_400, weight: 5.6, change: 3.1, price: 512.84, shares: 546, avgCost: 478.20, ytd:  7.2, target: 6, rating: 'AA', region: 'US' },
          { name: 'Eli Lilly',    symbol: 'LLY', marketValue: 220_000, pnl: 6_000, weight: 4.4, change: 2.8, price: 768.31, shares: 286, avgCost: 612.90, ytd: 25.4, target: 6, rating: 'A',  region: 'US' },
        ],
      },
    ],
  },
  {
    name: 'Fixed Income', marketValue: 1_800_000, pnl: 14_400, weight: 36, change: 0.8, ytd: 3.2, target: 34, region: 'Global',
    children: [
      {
        name: 'US Treasuries', marketValue: 1_200_000, pnl: 9_600, weight: 24, change: 0.8, ytd: 2.1, target: 22, region: 'US',
        children: [
          { name: '10Y Treasury', symbol: 'UST10', marketValue: 700_000, pnl: 5_600, weight: 14, change: 0.8, price:  98.42, shares:  7_113, avgCost:  97.80, ytd: 2.4, target: 14, rating: 'AAA', region: 'US' },
          { name: '2Y Treasury',  symbol: 'UST2',  marketValue: 500_000, pnl: 4_000, weight: 10, change: 0.8, price:  99.87, shares:  5_007, avgCost:  99.55, ytd: 1.8, target:  8, rating: 'AAA', region: 'US' },
        ],
      },
      {
        name: 'Corporate Bonds', marketValue: 600_000, pnl: 4_800, weight: 12, change: 0.8, ytd: 4.6, target: 12, region: 'US',
        children: [
          { name: 'IG Corp Bond ETF', symbol: 'LQD', marketValue: 600_000, pnl: 4_800, weight: 12, change: 0.8, price: 108.94, shares: 5_508, avgCost: 104.20, ytd: 4.6, target: 12, rating: 'BBB', region: 'US' },
        ],
      },
    ],
  },
  {
    name: 'Alternatives', marketValue: 600_000, pnl: -2_400, weight: 12, change: -0.4, ytd: 5.1, target: 12, region: 'Global',
    children: [
      { name: 'Gold ETF', symbol: 'GLD', marketValue: 350_000, pnl: -1_400, weight: 7, change: -0.4, price: 214.66, shares: 1_630, avgCost: 186.40, ytd:  9.8, target: 7, rating: 'NR', region: 'Global' },
      { name: 'REIT ETF', symbol: 'VNQ', marketValue: 250_000, pnl: -1_000, weight: 5, change: -0.4, price:  86.12, shares: 2_903, avgCost:  92.40, ytd: -2.1, target: 5, rating: 'BBB', region: 'US' },
    ],
  },
  { name: 'Cash', marketValue: 200_000, pnl: 0, weight: 4, change: 0, ytd: 0, target: 4, rating: 'AAA', region: 'US' },
];

// ---------- Trade blotter (flat) ----------
type Trade = {
  id: number;
  time: Date;
  side: 'BUY' | 'SELL';
  symbol: string;
  quantity: number;
  price: number;
  notional: number;
  change: number;
  trader: string;
  venue: string;
};

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'JPM', 'GS', 'UNH', 'LLY', 'GLD', 'VNQ', 'LQD', 'UST10', 'UST2'];
const TRADERS = ['J. Berenson', 'A. Liu', 'M. Patel', 'K. Okafor', 'R. Silva'];
const VENUES = ['NYSE', 'NASDAQ', 'ARCA', 'IEX', 'BATS'];

function generateTrades(n: number): Trade[] {
  const out: Trade[] = [];
  const start = new Date();
  start.setHours(9, 30, 0, 0);
  for (let i = 0; i < n; i++) {
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const quantity = Math.floor(Math.random() * 900) + 100;
    const price = Math.round((20 + Math.random() * 480) * 100) / 100;
    const time = new Date(start.getTime() + i * 12_000 + Math.random() * 8_000);
    out.push({
      id: i + 1,
      time,
      side: Math.random() > 0.5 ? 'BUY' : 'SELL',
      symbol,
      quantity,
      price,
      notional: Math.round(quantity * price * 100) / 100,
      change: Math.round((Math.random() * 10 - 5) * 100) / 100,
      trader: TRADERS[Math.floor(Math.random() * TRADERS.length)],
      venue: VENUES[Math.floor(Math.random() * VENUES.length)],
    });
  }
  return out;
}

const ALL_TRADES = generateTrades(2500);

// ---------- Cell templates ----------
const fmtCurrency = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const pnlTemplate = (ctx: { cell: { value: number } }) => {
  const v = ctx.cell.value ?? 0;
  const cls = v > 0 ? 'pnl-up' : v < 0 ? 'pnl-down' : 'pnl-flat';
  const arrow = v > 0 ? '▲' : v < 0 ? '▼' : '■';
  return (
    <span className={`pnl-cell ${cls}`}>
      <span className="arrow">{arrow}</span>
      {fmtCurrency(v)}
    </span>
  );
};

const changeTemplate = (ctx: { cell: { value: number } }) => {
  const v = ctx.cell.value ?? 0;
  const cls = v > 0 ? 'pnl-up' : v < 0 ? 'pnl-down' : 'pnl-flat';
  const arrow = v > 0 ? '▲' : v < 0 ? '▼' : '■';
  return (
    <span className={`pnl-cell ${cls}`}>
      <span className="arrow">{arrow}</span>
      {v.toFixed(2)}%
    </span>
  );
};

const sideTemplate = (ctx: { cell: { value: 'BUY' | 'SELL' } }) => {
  const v = ctx.cell.value;
  return <span className={`side-pill side-${v?.toLowerCase()}`}>{v}</span>;
};

const symbolTemplate = (ctx: { cell: { value: string } }) => (
  <span className="symbol-chip">{ctx.cell.value}</span>
);

// Color the Price cell based on whether it's above/below the position's avg cost
const priceTemplate = (ctx: { cell: { value: number; row: { data: Position } } }) => {
  const v = ctx.cell.value;
  const avg = ctx.cell.row?.data?.avgCost;
  if (v == null) return <span />;
  const diff = avg != null ? ((v - avg) / avg) * 100 : 0;
  const cls = diff > 0 ? 'pnl-up' : diff < 0 ? 'pnl-down' : 'pnl-flat';
  const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '■';
  return (
    <span className={`pnl-cell ${cls}`}>
      <span className="arrow">{arrow}</span>
      {v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </span>
  );
};

function App() {
  const [symbolFilter, setSymbolFilter] = useState<string | null>(null);

  const filteredTrades = useMemo(
    () => (symbolFilter ? ALL_TRADES.filter((t) => t.symbol === symbolFilter) : ALL_TRADES),
    [symbolFilter]
  );

  const onTreeSelection = (e: CustomEvent<any>) => {
    const rows: any[] = e.detail || [];
    const selected = rows[0];
    if (selected?.symbol) setSymbolFilter(selected.symbol);
    else setSymbolFilter(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Acme Capital — Portfolio Manager Dashboard</h1>
        <p className="subtitle">
          Ignite UI for React · <strong>Tile Manager</strong> · <strong>Tree Grid</strong> vs{' '}
          <strong>Data Grid</strong> · Material Dark
        </p>
      </header>

      <IgrTileManager className="tile-mgr" columnCount={2}>
        <IgrTile colSpan={1} rowSpan={1}>
          <div className="tile-body">
            <div className="card-header">
              <h2>Holdings by Asset Class</h2>
              <span className="tag tree">Tree Grid · roll-up</span>
            </div>
            <p className="hint">Click a leaf position to filter the blotter →</p>
            <div className="grid-wrap">
              <IgrTreeGrid
                data={portfolio}
                childDataKey="children"
                autoGenerate={false}
                allowFiltering={true}
                rowSelection="single"
                onSelectedRowsChange={onTreeSelection as any}
                height="100%"
                width="100%"
              >
                <IgrColumn field="name" header="Holding" dataType="string" sortable={true} width="230px" resizable={true} />
                <IgrColumn field="symbol" header="Symbol" dataType="string" sortable={true} width="90px" bodyTemplate={symbolTemplate as any} />
                <IgrColumn field="price" header="Price" dataType="currency" sortable={true} width="130px" bodyTemplate={priceTemplate as any} />
                <IgrColumn field="shares" header="Shares" dataType="number" sortable={true} width="110px" />
                <IgrColumn field="avgCost" header="Avg Cost" dataType="currency" sortable={true} width="110px" />
                <IgrColumn field="marketValue" header="Market Value" dataType="currency" sortable={true} width="140px" />
                <IgrColumn field="pnl" header="Day P&L" dataType="currency" sortable={true} width="140px" bodyTemplate={pnlTemplate as any} />
                <IgrColumn field="change" header="Chg %" dataType="number" sortable={true} width="100px" bodyTemplate={changeTemplate as any} />
                <IgrColumn field="ytd" header="YTD %" dataType="number" sortable={true} width="100px" bodyTemplate={changeTemplate as any} />
                <IgrColumn field="weight" header="Weight" dataType="percent" sortable={true} width="100px" />
                <IgrColumn field="target" header="Target" dataType="percent" sortable={true} width="100px" />
                <IgrColumn field="rating" header="Rating" dataType="string" sortable={true} width="90px" />
                <IgrColumn field="region" header="Region" dataType="string" sortable={true} width="110px" resizable={true} />
              </IgrTreeGrid>
            </div>
          </div>
        </IgrTile>

        <IgrTile colSpan={1} rowSpan={1}>
          <div className="tile-body">
            <div className="card-header">
              <h2>
                Today's Trade Blotter
                {symbolFilter && (
                  <span className="filter-chip">
                    {symbolFilter} <button type="button" onClick={() => setSymbolFilter(null)}>×</button>
                  </span>
                )}
              </h2>
              <span className="tag flat">Data Grid · peer rows</span>
            </div>
            <p className="hint">{filteredTrades.length.toLocaleString()} trades · sort, filter, virtualize</p>
            <div className="grid-wrap">
              <IgrGrid
                data={filteredTrades}
                autoGenerate={false}
                allowFiltering={true}
                primaryKey="id"
                height="100%"
                width="100%"
              >
                <IgrColumn field="id" header="#" dataType="number" width="70px" />
                <IgrColumn field="time" header="Time" dataType="time" sortable={true} width="160px" />
                <IgrColumn field="side" header="Side" dataType="string" sortable={true} width="90px" bodyTemplate={sideTemplate as any} />
                <IgrColumn field="symbol" header="Symbol" dataType="string" sortable={true} width="110px" bodyTemplate={symbolTemplate as any} />
                <IgrColumn field="quantity" header="Qty" dataType="number" sortable={true} width="100px" />
                <IgrColumn field="price" header="Price" dataType="currency" sortable={true} width="110px" />
                <IgrColumn field="notional" header="Notional" dataType="currency" sortable={true} width="140px" />
                <IgrColumn field="change" header="Chg %" dataType="number" sortable={true} width="110px" bodyTemplate={changeTemplate as any} />
                <IgrColumn field="trader" header="Trader" dataType="string" sortable={true} resizable={true} />
                <IgrColumn field="venue" header="Venue" dataType="string" sortable={true} width="100px" />
              </IgrGrid>
            </div>
          </div>
        </IgrTile>
      </IgrTileManager>

    </div>
  );
}

export default App;
