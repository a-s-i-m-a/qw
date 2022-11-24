import GoogleMapReact, {
    ClickEventValue,
    Coords,
    Props as GMapProps
} from "google-map-react";
import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddressIcon } from "../../../../ui/atoms/Icon";
import { salepointsStore } from "../../store/SalepointsStore";

interface MapProps {
    defaultCenter?: Coords;
    onChange?: (coords: google.maps.LatLngLiteral) => void;
    draggable?: boolean;
    zoomable?: boolean;
    enableFullScreen?: boolean;
    isDisabled?: boolean;
    onClick?: (value: ClickEventValue) => void;
    value?: Coords;
}

interface State {
    center: Coords;
    zoom: number;
}

const Marker: FC<Partial<Coords>> = () => (
    <AddressIcon className="absolute  transform -translate-x-1/2 -translate-y-1/2" />
);
let INITIAL_COORDS = { lat: 0, lng: 0 };

const key = process.env.REACT_APP_GOOGLE_KEY ?? "";
export const Map: FC<MapProps> = ({
    defaultCenter,
    onChange,
    onClick,
    zoomable,
    enableFullScreen,
    draggable = true,
    isDisabled,
    value
}) => {
    const { i18n } = useTranslation();
    const [isDraggable, setDraggable] = useState<boolean>(draggable);
    const [coords, setCoords] = useState<Coords | undefined>(
        defaultCenter || INITIAL_COORDS
    );
    const [state, setState] = useState<State>({
        center: defaultCenter || INITIAL_COORDS,
        zoom: 12
    });
    const { setCoordinates } = useContext(salepointsStore);

    useEffect(() => {
        if (value) {
            setState(prev => ({ ...prev, center: value }));
        }
        if (navigator.geolocation && !value) {
            navigator.geolocation.getCurrentPosition(pos => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setState(prev => ({ ...prev, center: { lat, lng } }));
            });
        }
    }, [value, defaultCenter]);

    const onInteraction: GMapProps["onChildMouseMove"] = (
        _childKey,
        _childProps,
        { lat, lng }
    ) => {
        setDraggable(false);
        setCoords({
            lat,
            lng
        });
    };
    const stopInteraction: GMapProps["onChildMouseUp"] = () => {
        setDraggable(true);
    };

    const initFn: GMapProps["onGoogleApiLoaded"] = ({
        maps,
        map
    }: {
        maps: any;
        map: google.maps.Map;
    }) => {
        map.data.setStyle({ fillColor: "transparent", strokeOpacity: 0 });

        map.data.addListener(
            "click",
            ({ latLng }: google.maps.PolyMouseEvent) => {
                const coords = latLng.toJSON();
                if (!isDisabled) {
                    setCoords(coords);
                    onChange && onChange(coords);
                }
            }
        );
    };
    const _onClick: GMapProps["onClick"] = ({ lat, lng }) => {
        const coordinates = [lat, lng];
        setCoordinates(coordinates);
        setCoords({
            lat,
            lng
        });
    };

    return (
        <GoogleMapReact
            onClick={_onClick}
            draggable={isDraggable}
            center={state.center}
            zoom={state.zoom}
            onChildMouseDown={onInteraction}
            onChildMouseUp={stopInteraction}
            onChildMouseMove={onInteraction}
            bootstrapURLKeys={{
                language: i18n.language,
                key
            }}
            onGoogleApiLoaded={initFn}
            yesIWantToUseGoogleMapApiInternals={true}
            options={{
                zoomControl: zoomable,
                controlSize: 28,
                keyboardShortcuts: false,
                fullscreenControl: enableFullScreen,
                disableDefaultUI: true,
                streetViewControl: false,
                disableDoubleClickZoom: !zoomable,
                scrollwheel: zoomable
            }}
        >
            {coords && <Marker lat={coords.lat} lng={coords.lng} />}
        </GoogleMapReact>
    );
};
