import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import { AppLayout } from "@flowkit/shared-ui";
import UniversityMap from './components/UniversityMap/index';

function App() {
  return (
    <AppLayout>
      <div className="w-full h-full min-h-screen">
        <UniversityMap />
      </div>
    </AppLayout>
  );
}

export default App;
