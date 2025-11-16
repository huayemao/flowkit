import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
} from "@flowkit/shared-ui";
import { BilibiliSubtitleExtractor } from './index';

export default function App() {
  const { t } = useTranslation();

  return (
    <AppLayout
      toolName="B站字幕提取器"
      toolDescription="提取B站视频字幕，支持SRT和TXT格式下载，提供多种字幕语言选择"
      title="B站字幕提取器"
      subtitle="提取B站视频字幕，支持SRT和TXT格式下载，提供多种字幕语言选择"
      keywords="B站,字幕提取,视频字幕,SRT,TXT,下载"
      ogTitle="B站字幕提取器"
      ogDescription="提取B站视频字幕，支持SRT和TXT格式下载，提供多种字幕语言选择"
      twitterTitle="B站字幕提取器"
      twitterDescription="提取B站视频字幕，支持SRT和TXT格式下载，提供多种字幕语言选择"
      showTitle={true}
      titleCentered={true}
    >
      <BilibiliSubtitleExtractor />
    </AppLayout>
  );
}