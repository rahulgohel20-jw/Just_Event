import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Search, MapPin, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Vite/webpack breaks Leaflet's default marker icon resolution — patch it
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [23.0225, 72.5714]; // Ahmedabad fallback

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 15, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
};

const ClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationPicker = ({ latitude, longitude, onChange }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);

  const lat = latitude ? parseFloat(latitude) : null;
  const lng = longitude ? parseFloat(longitude) : null;
  const markerPosition = lat && lng ? [lat, lng] : null;

  const runSearch = useCallback(async (text) => {
    if (!text || text.trim().length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=5&q=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error("Location search failed:", err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 400);
  };

  const handleSelectResult = (result) => {
    onChange(parseFloat(result.lat), parseFloat(result.lon));
    setQuery(result.display_name);
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for a location..."
          className="w-full rounded-lg border border-gray-400 pl-9 pr-9 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]"
        />
        {searching && (
          <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        )}
        {showResults && results.length > 0 && (
          <div className="absolute z-[1000] mt-1 w-full rounded-lg border border-rose-100 bg-white shadow-lg max-h-56 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.place_id}
                type="button"
                onClick={() => handleSelectResult(r)}
                className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs hover:bg-[#FBF1F3]"
              >
                <MapPin size={13} className="mt-0.5 shrink-0 text-[#7A2E45]" />
                <span className="text-gray-700">{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-56 w-full overflow-hidden rounded-lg border border-gray-300">
        <MapContainer
          center={markerPosition || DEFAULT_CENTER}
          zoom={markerPosition ? 15 : 12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ClickHandler onPick={onChange} />
          <RecenterMap lat={lat} lng={lng} />
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat: newLat, lng: newLng } = e.target.getLatLng();
                  onChange(newLat, newLng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="text-[11px] text-gray-400">
        Search, click on the map, or drag the pin to set the exact location.
      </p>
    </div>
  );
};

export default LocationPicker;