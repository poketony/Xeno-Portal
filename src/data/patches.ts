export interface Patch {
  id: string; workId: string; editionIds: string[]; name: string; author: string;
  version?: string; releaseDate?: string; fileSize?: string;
  distributionUrl?: string; downloadUrl?: string; mirrors?: { label: string; url: string }[];
  instructions: string[]; changes: string[]; knownIssues: string[];
  originalFiles?: { name: string; algorithm: 'SHA-256' | 'SHA-1' | 'MD5'; hash: string }[];
}

// 실제 배포 정보를 받은 뒤 등록합니다. 빈 배열은 제작 상태를 의미하지 않습니다.
export const patches: Patch[] = [];
