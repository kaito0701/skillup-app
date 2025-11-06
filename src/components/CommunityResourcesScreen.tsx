import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Calendar, Users, Briefcase, GraduationCap, Loader2, Home, BookOpen, User } from "lucide-react";
import { AnimatedCard } from "./AnimatedCard";
import { Badge } from "./ui/badge";
import { AnimatedButton } from "./AnimatedButton";
import { FeedbackFooterLink } from "./FeedbackFooterLink";
import { motion } from "motion/react";
import { getAllResources } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface CommunityResourcesScreenProps {
  onNavigate: (screen: string) => void;
}

const iconMap: any = {
  "Training Center": GraduationCap,
  "Job Fair": Briefcase,
  "Workshop": Users,
  "General": MapPin,
};

const colorMap: any = {
  "Training Center": "from-blue-500 to-blue-600",
  "Job Fair": "from-emerald-500 to-emerald-600",
  "Workshop": "from-purple-500 to-purple-600",
  "General": "from-orange-500 to-orange-600",
};

export function CommunityResourcesScreen({ onNavigate }: CommunityResourcesScreenProps) {
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstanceRef = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isMountedRef = useRef(true);
  const isScriptLoadingRef = useRef(false);
  const isScriptLoadedRef = useRef(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const data = await getAllResources();
      setResources(data || []);
      
      // If no resources, add some defaults
      if (!data || data.length === 0) {
        setResources([
          {
            id: "default-1",
            type: "Training Center",
            name: "TESDA Manila Training Center",
            address: "Muralla St, Intramuros, Manila",
            contact: "",
            latitude: 14.5906,
            longitude: 120.9736,
          },
          {
            id: "default-2",
            type: "Job Fair",
            name: "Metro Manila Career Expo 2025",
            address: "SM Megamall, Mandaluyong City",
            contact: "",
            latitude: 14.5854,
            longitude: 121.0565,
          }
        ]);
      }
    } catch (error: any) {
      console.error("Failed to load resources:", error);
      toast.error("Failed to load resources");
      
      // Use fallback data
      setResources([
        {
          id: "fallback-1",
          type: "Training Center",
          name: "TESDA Manila Training Center",
          address: "Muralla St, Intramuros, Manila",
          contact: "",
          latitude: 14.5906,
          longitude: 120.9736,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    if (resources.length === 0) return;

    // Check if Leaflet is already loaded globally
    // @ts-ignore
    if (typeof window.L !== "undefined" && !isScriptLoadedRef.current) {
      console.log("Leaflet already loaded globally");
      isScriptLoadedRef.current = true;
      setTimeout(() => {
        if (isMountedRef.current) {
          initMap();
        }
      }, 100);
      return;
    }

    // Prevent multiple script loads
    if (isScriptLoadingRef.current || isScriptLoadedRef.current) {
      console.log("Leaflet script already loading or loaded");
      return;
    }

    isScriptLoadingRef.current = true;

    // Clean up any existing Leaflet elements BEFORE initialization
    try {
      const existingLeafletElements = document.querySelectorAll('[class*="leaflet"]');
      existingLeafletElements.forEach(el => {
        try {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        } catch (e) {
          // Silently fail
        }
      });
    } catch (e) {
      // Silently fail
    }

    // Load Leaflet JS (CSS is already in index.html)
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.async = false; // Load synchronously for reliability
    
    script.onload = () => {
      console.log("Leaflet loaded successfully");
      isScriptLoadedRef.current = true;
      isScriptLoadingRef.current = false;
      
      // Check if component is still mounted before initializing
      setTimeout(() => {
        if (isMountedRef.current) {
          initMap();
        } else {
          console.log("Component unmounted, skipping map initialization");
        }
      }, 100);
    };
    
    script.onerror = (error) => {
      console.error("Failed to load Leaflet:", error);
      isScriptLoadingRef.current = false;
      if (isMountedRef.current) {
        toast.error("Failed to load map. Please refresh the page.");
      }
    };
    
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;

      // Step 1: Destroy the map instance FIRST
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          console.error("Error removing map:", e);
        }
      }

      // Step 2: IMMEDIATELY remove ALL Leaflet elements (no setTimeout)
      try {
        // Remove all elements with leaflet in class name from the ENTIRE document
        const allLeafletElements = document.querySelectorAll('[class*="leaflet"]');
        allLeafletElements.forEach(el => {
          try {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          } catch (e) {
            // Silently fail
          }
        });
      } catch (e) {
        // Silently fail
      }

      // Step 3: Clear the map container
      try {
        const mapContainer = document.getElementById("community-map");
        if (mapContainer) {
          mapContainer.innerHTML = "";
          mapContainer.removeAttribute("style");
        }
      } catch (e) {
        // Silently fail
      }

      // Step 4: Remove script (CSS stays in index.html)
      // Don't remove the script to prevent reloading on re-mount
      // The script is idempotent and Leaflet is attached to window
      try {
        if (scriptRef.current && scriptRef.current.parentNode) {
          // Only remove if we're sure we won't need it again
          // scriptRef.current.parentNode.removeChild(scriptRef.current);
          scriptRef.current = null;
        }
      } catch (e) {
        // Silently fail
      }
      
      // Reset loading flags for potential re-mount
      // But keep isScriptLoadedRef true since script stays in DOM
      isScriptLoadingRef.current = false;

      // Step 5: Remove specific high-z-index Leaflet panes that might stick
      try {
        const leafletPanes = document.querySelectorAll('.leaflet-pane, .leaflet-map-pane, .leaflet-tile-pane, .leaflet-overlay-pane, .leaflet-shadow-pane, .leaflet-marker-pane, .leaflet-tooltip-pane, .leaflet-popup-pane');
        leafletPanes.forEach(el => {
          try {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          } catch (e) {
            // Silently fail
          }
        });
      } catch (e) {
        // Silently fail
      }

      // Step 6: Double-check cleanup after a brief delay
      setTimeout(() => {
        try {
          const remaining = document.querySelectorAll('[class*="leaflet"]');
          remaining.forEach(el => {
            try {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
            } catch (e) {
              // Silently fail
            }
          });
        } catch (e) {
          // Silently fail
        }
      }, 50);
    };
  }, [resources]);

  const initMap = () => {
    // Check if component is still mounted
    if (!isMountedRef.current) {
      console.log("Component unmounted, skipping map initialization");
      return;
    }

    // @ts-ignore
    if (typeof L === "undefined" && typeof window.L === "undefined") {
      console.error("Leaflet (L) is not defined. Map cannot initialize.");
      if (isMountedRef.current) {
        toast.error("Map failed to load. Please refresh the page.");
      }
      return;
    }

    const mapContainer = document.getElementById("community-map");
    if (!mapContainer) {
      console.error("Map container not found - DOM element missing");
      console.log("This might happen if component unmounted before map initialized");
      return;
    }

    // Clear any existing content
    mapContainer.innerHTML = "";

    try {
      // Calculate center from resources
      const avgLat = resources.reduce((sum, r) => sum + (r.latitude || 14.5995), 0) / resources.length;
      const avgLng = resources.reduce((sum, r) => sum + (r.longitude || 120.9842), 0) / resources.length;

      // Use global L object
      // @ts-ignore
      const LeafletLib = window.L || L;

      // @ts-ignore
      const map = LeafletLib.map("community-map", {
        center: [avgLat, avgLng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
        touchZoom: true,
        dragging: true,
      });
      
      // Store the map instance in ref for cleanup
      mapInstanceRef.current = map;

      // @ts-ignore
      LeafletLib.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 10,
      }).addTo(map);

      // Custom icon styling
      const customIcon = (color: string) => {
        // @ts-ignore
        return LeafletLib.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
      };

      // Add markers for each resource
      resources.forEach((resource, index) => {
        const markerColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];
        const markerColor = markerColors[index % markerColors.length];
        
        // Use resource coordinates or skip if invalid
        const lat = resource.latitude && !isNaN(resource.latitude) ? Number(resource.latitude) : null;
        const lng = resource.longitude && !isNaN(resource.longitude) ? Number(resource.longitude) : null;
        
        if (lat && lng) {
          // @ts-ignore
          LeafletLib.marker([lat, lng], { icon: customIcon(markerColor) })
            .addTo(map)
            .bindPopup(`<div style="font-family: system-ui, sans-serif; padding: 4px;">
              <strong style="color: #1f2937; font-size: 14px;">${resource.name}</strong><br/>
              <span style="color: #6b7280; font-size: 12px;">${resource.address}</span>
            </div>`);
        }
      });

      // Force map to invalidate size after a brief moment (fixes display issues)
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      console.log("Map initialized successfully");
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to initialize map. Please try refreshing.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading community resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background pb-32">
      <FeedbackFooterLink onNavigate={onNavigate} />
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Community Resources 🌟</h1>
            <p className="text-indigo-100">Discover training & opportunities near you!</p>
          </div>
        </div>

        {/* Location Badge */}
        <div className="bg-white/20 rounded-full px-4 py-2 inline-flex items-center gap-2">
          <MapPin className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Metro Manila</span>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="px-6 -mt-12 mb-6">
        <AnimatedCard className="bg-white rounded-2xl shadow-lg overflow-hidden relative z-10" style={{ isolation: 'isolate' }}>
          <div 
            id="community-map" 
            className="h-64 w-full bg-gray-100 relative z-0"
            style={{ minHeight: '256px', height: '256px' }}
          ></div>
        </AnimatedCard>
      </div>

      {/* Resources List */}
      <div className="px-6 pb-24">
        <h3 className="text-gray-800 mb-4">Opportunities Waiting for You 💼</h3>
        
        {resources.length === 0 ? (
          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-md text-center">
            <p className="text-gray-600">No resources available yet.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for training centers and job fairs!</p>
          </AnimatedCard>
        ) : (
          <div className="space-y-4">
            {resources.map((resource, index) => {
              const IconComponent = iconMap[resource.type] || MapPin;
              const color = colorMap[resource.type] || "from-gray-500 to-gray-600";
              const glowColors: Array<"orange" | "amber" | "yellow" | "pink" | "rose" | "purple"> = 
                ["orange", "amber", "pink", "yellow", "rose", "purple"];
              
              return (
                <AnimatedCard 
                  key={resource.id} 
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                  slideFrom={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.1}
                  glowColor={glowColors[index % glowColors.length]}
                >
                  <div className={`bg-gradient-to-r ${color} px-4 py-2`}>
                    <Badge className="bg-white/20 text-white border-0">
                      {resource.type}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`bg-gradient-to-br ${color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-1">{resource.name}</h4>
                        <div className="flex items-start gap-2 text-gray-600 text-sm mb-1">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="flex-1">{resource.address}</span>
                        </div>
                        {resource.contact && (
                          <div className="text-gray-600 text-sm">
                            📞 {resource.contact}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-30">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => onNavigate("modules")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Learn</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-indigo-600">
            <MapPin className="w-6 h-6" />
            <span className="text-xs">Community</span>
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
