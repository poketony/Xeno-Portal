export interface Chapter {
  id: string; title: string; order: number;
  // public/를 제외한 경로. 원본 폴더 및 파일명을 그대로 유지합니다.
  file: string; resourceBase: string;
  width: number; height: number; allowDownload: boolean;
  parameters?: Record<string, string>;
  fontSources?: string[];
}

// 실제 자료의 로더·부속 파일·장 구성을 먼저 조사한 뒤 등록하세요.
// 장 수와 SWF 수가 같다고 가정하지 않습니다. 예시는 README에 있습니다.
export const chapters: Chapter[] = [];
export const ruffleVersion = '0.7.1';
