This project is tree map component with React and [D3.js](https://d3js.org)

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Learn More

There are some functions, such as zoom in, zoom out, scale, add node, delete node

### `Data Source`

export default {
  name: 'flare',
  type: 'prod',
  children: [
    {
      name: 'data',
      type: 'prod',
      tmp: '3200tpm',
      error: '14err',
      avgTime: '1234ms',
      children: [
        { 
          name: 'DataField',
          type: 'prod',
          tmp: '3240tpm',
          error: '19err',
          avgTime: '1334ms'
        },
        { 
          name: 'DataSchema',
          type: 'stage',
          tmp: '3280tpm',
          error: '12err',
          avgTime: '1934ms',
        },
        {
          name: 'DataSet',
          type: 'stage',
          tmp: '3200tpm',
          error: '14err',
          avgTime: '1234ms'
        }
      ]
    },
    {
      name: 'methods',
      type: 'prod',
      tmp: '3200tpm',
      error: '14err',
      avgTime: '1234ms',
      children: [
        {
          name: 'add',
          type: 'stage',
          tmp: '3200tpm',
          error: '94err',
          avgTime: '1214ms',
        },
        {
          name: 'count',
          type: 'prod',
          tmp: '3210tpm',
          error: '13err',
          avgTime: '1239ms',
        },
        { 
          name: 'mul', 
          type: 'prod',
          tmp: '3200tpm',
          error: '14err',
          avgTime: '1234ms'
        },
        {
          name: 'sum',
          type: 'stage',
          tmp: '3200tpm',
          error: '14err',
          avgTime: '1234ms'
        }
      ]
    }
  ]
}

### `Image Presentation`
![Image text](https://github.com/Fine0830/tree-map-react/blob/master/src/assets/tree-map.png)
