# FullscreenControl

React component that wraps [FullscreenControl](https://docs.mapbox.com/mapbox-gl-js/api/markers/#fullscreencontrol).

```js
import * as React from 'react';
import Map, {FullscreenControl} from 'react-map-gl';

function App() {
  return <Map
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5
    }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    <FullscreenControl />
  </Map>;
}
```

## Properties

Note that the following properties are not reactive. They are only used when the component first mounts.

#### containerId: string

Id of the DOM element which should be made full screen. By default, the map container element will be made full screen.
  
#### position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

Default: `'top-right'`

Placement of the control relative to the map.

#### style: CSSProperties

CSS style override that applies to the control's container.

## Source

[fullscreen-control.ts](https://github.com/visgl/react-map-gl/tree/7.0-dev/src/components/fullscreen-control.ts)
