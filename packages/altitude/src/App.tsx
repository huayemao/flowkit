import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
} from "@flowkit/shared-ui";
import { Altitude } from './index';

// FAQ数据
const altitudeFAQData = [
  {
    question: "What is altitude?",
    answer: "Altitude is the height of an object or point in relation to sea level or ground level. It's commonly measured in meters or feet and is important for aviation, hiking, weather forecasting, and geographical studies."
  },
  {
    question: "How accurate is the altitude data?",
    answer: "Our altitude data uses multiple APIs including OpenStreetMap/Nominatim and AMap to provide accurate elevation information. The accuracy typically ranges from 5-30 meters depending on the location and data source availability."
  },
  {
    question: "Can I compare altitudes of multiple locations?",
    answer: "Yes! You can search for cities worldwide and compare their altitudes side by side. The tool allows you to select multiple cities and sort them by elevation in ascending or descending order."
  },
  {
    question: "What coordinate systems are supported?",
    answer: "The tool supports decimal degrees format for latitude and longitude coordinates. You can input coordinates directly or search for locations by name to get their altitude information."
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, the altitude tool is completely free to use. You can search for unlimited locations and compare altitudes without any registration or fees."
  }
];

function App() {

  return (
    <AppLayout 
      toolName="Altitude Finder"
      toolDescription="Find and compare altitudes of cities and locations worldwide. Get accurate elevation data with coordinate search and city database."
      faqData={altitudeFAQData}
    >
      <div className="max-w-7xl self-stretch lg:min-w-[960px]  mx-auto w-full">
        <Altitude />
      </div>
    </AppLayout>
  );
}

export default App;
