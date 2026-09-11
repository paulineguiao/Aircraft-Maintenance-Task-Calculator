# Aircraft Maintenance Task Calculator

A lightweight, spreadsheet-style web app for tracking aircraft component maintenance intervals — comparing current values and intervals against TSN/TSI/TSO (Time Since New / Install / Overhaul) to see what's coming due.

Built for anyone who needs a quick way to manage a maintenance task list without opening a full spreadsheet program, with the option to import directly from an existing Excel file.

## Features

- **Editable worksheet** — starts with 10 rows, add or delete rows as needed
- **Auto-calculation** — each row computes `Current + Interval − TSN/TSI/TSO` live as you type
- **Duplicate row** — clone a row's description when logging multiple units of the same task
- **Excel import** — load a `.xlsx` file that follows the fixed column layout (Description, Current, Interval, TSN/TSI/TSO, Unit)
- **Excel export** — download your worksheet, computed values included, as a ready-to-share `.xlsx`

## Tech stack

Plain HTML, CSS, and JavaScript — no build step, no framework. Excel import/export is handled client-side with [SheetJS](https://sheetjs.com/).

## Running it

No installation needed. Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/<your-username>/task-calculator.git
cd task-calculator
open index.html   # or just double-click the file
```

## Importing a spreadsheet

The first row of the file is treated as a header and skipped. Columns must appear in this order:

| Description | Current | Interval | TSN/TSI/TSO | Unit |
|---|---|---|---|---|

## About this project

I designed the concept, the data model, and the workflow (the fixed-column quick import, the calculation logic, the row-based editing) for my own use tracking maintenance tasks. The implementation was built with AI assistance (Claude).

## License

MIT — feel free to use or adapt this for your own tracking needs.
