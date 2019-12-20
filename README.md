# AgGridComponents

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Resize columns based on screen size

Resize the columns based on the screen size - It should be given on onGridReady

```
  const eGridDiv = document.querySelector('.my-grid');
  const allColumnIds = [];
  const columnNames = ['0', 'action', 'collectionName'];
    // auto sizing columns

     if (eGridDiv.clientWidth <= 768) {
       this.columnApi.getAllColumns().forEach(function (column) {
         if (columnNames.includes(column.colId)) {
           allColumnIds.push(column.colId);
         }
       });
       this.columnApi.autoSizeColumns(allColumnIds);
     } else {
       params.api.sizeColumnsToFit();
     }
```

## Show Columns Based on Screen Size

Show the columns based on screen size that is if the screen size is for mobile then show only 2 columns else show all columns - It should be given on onGridReady

```
if (eGridDiv.clientWidth <= 768) {
      this.columnDefs = [
        { headerName: 'ID', width: 100, valueGetter: (args) => this.getIdValue(args) },
        {
          headerName: 'Action',
          field: 'action',
          debounceMs: 2000,
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true }
        },
        { headerName: 'Collection', field: 'collectionName'}
      ];
      this.defaultColDefs = {
        filter: true
      };
    } else {
      this.columnDefs = [
        { headerName: 'ID', width: 100, valueGetter: (args) => this.getIdValue(args) },
        {
          headerName: 'Action',
          field: 'action',
          debounceMs: 2000,
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true }
        },
        { headerName: 'Collection', field: 'collectionName'},
        { headerName: 'Date', field: 'date'},
        { headerName: 'End Point', field: 'endpoint'},
        { headerName: 'IP', field: 'ipAddress' },
        { headerName: 'Method', field: 'method' },
        { headerName: 'Status Code', field: 'statusCode' },
      ];
      this.defaultColDefs = {
        filter: true
      };
    }
```
