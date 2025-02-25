/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

export type LicenseUnlockResult = Readonly<{
  isTrial: boolean;
  hasPing: boolean;
  licenseId: string;
  licensee: string;
  applicationIds: Array<string>;
  packageName: string;
  sdkName: string;
  sdkVersion: string;
  unlockResult: LicenseTokenState;
  licenseError: string;
}>;

export enum LicenseTokenState {
  Invalid,
  RequiresServerPermission,
  Valid,
}

export type LicenseRequest = Readonly<{
  licenseId: string;
  licensee: string;
  applicationIds: Array<string>;
  packageName: string;
  platform: string;
  sdkName: string;
  sdkVersion: string;
}>;

export type LicenseStatusResponse = Record<string, string>;

export type ServerPermissionSubmitResult = Readonly<{
  status: ServerPermissionSubmitResultStatus;
  lease: number;
  networkErrorDescription?: string;
}>;

export enum ServerPermissionSubmitResultStatus {
  Ok,
  NetworkError,
  RemoteLock,
  PermissionExpired,
  PayloadCorrupted,
  PayloadSignatureVerificationFailed,
  IncorrectTokenState,
}
