import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
  useTranslation,
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
  const { t } = useTranslation();
  const faqData = [
    {
      question: t('altitude.faq.q1'),
      answer: t('altitude.faq.a1'),
    },
    {
      question: t('altitude.faq.q2'),
      answer: t('altitude.faq.a2'),
    },
    {
      question: t('altitude.faq.q3'),
      answer: t('altitude.faq.a3'),
    },
    {
      question: t('altitude.faq.q4'),
      answer: t('altitude.faq.a4'),
    },
    {
      question: t('altitude.faq.q5'),
      answer: t('altitude.faq.a5'),
    },
  ];

  return (
    <AppLayout
      toolName={t('altitude.title')}
      toolDescription={t('altitude.description')}
      faqData={faqData}
      title={t('altitude.title')}
      subtitle={t('altitude.description')}
      keywords={t('altitude.keywords')}
      ogTitle={t('altitude.title')}
      ogDescription={t('altitude.description')}
      twitterTitle={t('altitude.title')}
      twitterDescription={t('altitude.description')}
      showTitle={true}
      titleCentered={true}
    >
      <Altitude />
    </AppLayout>
  );
}

export default App;
