import * as React from 'react';
import {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  forwardRef,
  useImperativeHandle
} from 'react';

import {MountedMapsContext} from './use-map';
import Mapbox, {MapboxProps} from '../mapbox/mapbox';
import createRef, {MapRef} from '../mapbox/create-ref';

import type {CSSProperties} from 'react';
import type {MapboxMap} from '../types';
import useIsomorphicLayoutEffect from '../utils/use-isomorphic-layout-effect';
import setGlobals, {GlobalSettings} from '../utils/set-globals';

export type MapContextValue = {
  mapLib: any;
  map: MapboxMap;
};

export const MapContext = React.createContext<MapContextValue>(null);

export type MapProps = MapboxProps &
  GlobalSettings & {
    mapLib?: any;
    /** Map container id */
    id?: string;
    /** Map container CSS style */
    style?: CSSProperties;
    children?: any;
  };

const defaultProps: MapProps = {
  // Constraints
  minZoom: 0,
  maxZoom: 22,
  minPitch: 0,
  maxPitch: 85,

  // Interaction handlers
  scrollZoom: true,
  boxZoom: true,
  dragRotate: true,
  dragPan: true,
  keyboard: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
  touchPitch: true,

  // Style
  mapStyle: {version: 8, sources: {}, layers: []},
  styleDiffing: true,
  projection: 'mercator',
  renderWorldCopies: true,

  // Callbacks
  onError: e => console.error(e.error), // eslint-disable-line

  // Globals
  RTLTextPlugin:
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js'
};

const Map = forwardRef<MapRef, MapProps>((props, ref) => {
  const mountedMapsContext = useContext(MountedMapsContext);
  const [mapInstance, setMapInstance] = useState<Mapbox>(null);
  const containerRef = useRef();

  const {current: contextValue} = useRef<MapContextValue>({mapLib: null, map: null});

  useEffect(() => {
    const mapLib = props.mapLib;
    let isMounted = true;
    let mapbox;

    Promise.resolve(mapLib || import('mapbox-gl'))
      .then(mapboxgl => {
        if (!isMounted) {
          return;
        }

        if (!mapboxgl.Map) {
          // commonjs style
          mapboxgl = mapboxgl.default;
        }
        if (!mapboxgl || !mapboxgl.Map) {
          throw new Error('Invalid mapLib');
        }

        if (mapboxgl.supported(props)) {
          setGlobals(mapboxgl, props);
          mapbox = new Mapbox(mapboxgl.Map, props);
          mapbox.initialize(containerRef.current);
          contextValue.map = mapbox.map;
          contextValue.mapLib = mapboxgl;

          setMapInstance(mapbox);
          mountedMapsContext?.onMapMount(createRef(mapbox, mapboxgl), props.id);
        } else {
          throw new Error('Map is not supported by this browser');
        }
      })
      .catch(error => {
        props.onError({
          type: 'error',
          target: null,
          originalEvent: null,
          error
        });
      });

    return () => {
      isMounted = false;
      if (mapbox) {
        mountedMapsContext?.onMapUnmount(props.id);
        mapbox.destroy();
      }
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (mapInstance) {
      mapInstance.setProps(props);
    }
  });

  useImperativeHandle(ref, () => createRef(mapInstance, contextValue.mapLib), [mapInstance]);

  const style: CSSProperties = useMemo(
    () => ({
      position: 'relative',
      width: '100%',
      height: '100%',
      ...props.style
    }),
    [props.style]
  );

  return (
    <div id={props.id} ref={containerRef} style={style}>
      {mapInstance && (
        <MapContext.Provider value={contextValue}>{props.children}</MapContext.Provider>
      )}
    </div>
  );
});

Map.displayName = 'Map';
Map.defaultProps = defaultProps;

export default Map;
