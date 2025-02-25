/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { DateResult } from "./DateResult";
import { StringResult } from "./StringResult";

/**
 * The additional information on vehicle class.
 */

export interface VehicleClassInfo {
  vehicleClass: StringResult;

  licenceType: StringResult;

  effectiveDate: DateResult;

  expiryDate: DateResult;
}
